# 🔐 认证接口文档

> FastAPI BFF — 统一认证模块，支持多应用（doxie / 8bit / thinksy）

---

## 通用说明

- **Base URL**: `http://127.0.0.1:8000`
- **Content-Type**: `application/json`
- **统一响应格式**:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- **所有接口都需要 Header**:

| Header | 必填 | 说明 |
|---|---|---|
| `X-App-Code` | ✅ | 应用标识，取值 `doxie` / `8bit` / `thinksy` |

---

## 1. 发送注册验证码

在注册前调用，验证码发到用户邮箱。

```
POST /api/auth/register/send-code
```

### 请求体

```json
{
  "email": "user@example.com"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| email | string | ✅ | 合法邮箱格式 |

### 成功响应（code: 0）

```json
{
  "code": 0,
  "message": "success"
}
```

> 验证码有效期为 5 分钟。同一邮箱同一类型在有效期内不会重复发送。

### 失败场景

| HTTP | code | message | 说明 |
|---|---|---|---|
| 200 | 400 | "Email already registered" | 该邮箱已被注册 |
| 200 | 400 | "Code already sent. Please check your email or try again in X minutes." | 验证码已发送，冷却中 |

---

## 2. 注册

```
POST /api/auth/register
```

### 请求体

```json
{
  "email": "user@example.com",
  "password": "your_password",
  "code": "123456"
}
```

| 字段 | 类型 | 必填 | 约束 |
|---|---|---|---|
| email | string | ✅ | 合法邮箱格式 |
| password | string | ✅ | **至少 6 位** |
| code | string | ✅ | 6 位验证码 |

### 成功响应（code: 0）

```json
{
  "code": 0,
  "message": "success"
}
```

> ⚠️ 注册成功后不会自动登录，前端需要再调一次登录接口获取 token。

### 失败场景

| HTTP | code | message | 说明 |
|---|---|---|---|
| 200 | 400 | "Password must be at least 6 characters" | 密码太短 |
| 200 | 400 | "Email already registered" | 该邮箱已被注册 |
| 200 | 400 | "Invalid or expired code." | 验证码已过期 |
| 200 | 400 | "Invalid code." | 验证码错误 |

---

## 3. 登录

```
POST /api/auth/login
```

### 请求体

```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| email | string | ✅ | 合法邮箱格式 |
| password | string | ✅ | 用户密码 |

### 成功响应（code: 0）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "uuid-string",
    "email": "user@example.com",
    "nickname": "DOXIE_aB3x",
    "avatar": "https://www.kaoiki.com/default.webp",
    "token": "base64url-random-43-chars...",
    "expires_at": "2026-04-22T12:00:00+00:00"
  }
}
```

| 返回字段 | 类型 | 说明 |
|---|---|---|
| user_id | string | 用户 ID |
| email | string | 邮箱 |
| nickname | string | 自动生成的昵称（`{APP_CODE}_4位随机字符`） |
| avatar | string | 默认头像 URL |
| token | string | **Bearer Token**，后续请求需带上 |
| expires_at | string | Token 过期时间（ISO8601），默认 **7 天** |

> 后续请求需在 Header 中带上 `Authorization: Bearer <token>`。

### 失败场景

| HTTP | code | message | 说明 |
|---|---|---|---|
| 200 | 400 | "Invalid email or password" | 邮箱未注册 或 密码错误 |
| 200 | 400 | "Account is frozen" | 账号被冻结 |
| 200 | 400 | "Account is deactivated" | 账号已注销 |

---

## 4. 发送重置密码验证码

```
POST /api/auth/password/send-code
```

### 请求体

```json
{
  "email": "user@example.com"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| email | string | ✅ | 合法邮箱格式 |

### 成功响应（code: 0）

```json
{
  "code": 0,
  "message": "success"
}
```

### 失败场景

| HTTP | code | message | 说明 |
|---|---|---|---|
| 200 | 400 | "Email not found" | 该邮箱未注册 |

---

## 5. 重置密码

```
POST /api/auth/password/reset
```

### 请求体

```json
{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "new_password123"
}
```

| 字段 | 类型 | 必填 | 约束 |
|---|---|---|---|
| email | string | ✅ | 合法邮箱格式 |
| code | string | ✅ | 6 位验证码 |
| new_password | string | ✅ | **至少 6 位** |

### 成功响应（code: 0）

```json
{
  "code": 0,
  "message": "success"
}
```

### 失败场景

| HTTP | code | message | 说明 |
|---|---|---|---|
| 200 | 400 | "Password must be at least 6 characters" | 新密码太短 |
| 200 | 400 | "Email not found" | 该邮箱未注册 |
| 200 | 400 | "Invalid or expired code." | 验证码已过期 |
| 200 | 400 | "Invalid code." | 验证码错误 |

---

## 前端对接流程

### 注册流程

```
发送验证码  ──→  用户查收邮件  ──→  提交注册
/send-code       (5分钟内)        /register
```

### 登录流程

```
提交登录  ──→  拿到 token  ──→  后续请求带上
/login          Bearer Token    Authorization Header
```

### 找回密码流程

```
发送验证码  ──→  用户查收邮件  ──→  重置密码
/send-code       (5分钟内)        /reset
```

---

## 注意事项

1. **验证码有效期**：5 分钟，过期需重新发送
2. **Token 有效期**：7 天，过期需重新登录
3. **密码要求**：至少 6 位
4. **密码存储**：SHA256 哈希存储，非明文
5. **多应用隔离**：同一邮箱可在不同 app_code 下分别注册账号
