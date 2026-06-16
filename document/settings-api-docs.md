# Setting 模块 — 前端对接文档

> 通用模块，适用于 doxie / 8bit / thinksy 所有应用
> Base URL: `https://www.heartbeat.cool:2248`
> Content-Type: `application/json`

---

## 通用规则

**Header 必传**

| Header | 必填 | 说明 |
|---|---|---|
| `X-App-Code` | ✅ | `doxie` / `8bit` / `thinksy` |
| `Authorization` | ✅ | `Bearer <token>` |

**响应格式**

```json
{ "code": 0, "message": "success", "data": {} }
```

> 注意：`code: 0` 表示成功，**不是** `code: 200`

---

## 接口列表

### 1. 获取用户资料

```
GET /api/profile
```

**需要登录** ✅

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "nickname": "DOXIE_aB3x",
    "avatar": "https://www.kaoiki.com/default.webp",
    "bio": "热爱生活",
    "google_bound": false
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| nickname | string | 用户昵称 |
| avatar | string | 头像 URL |
| bio | string / null | 个人简介 |
| google_bound | bool | Google 账号绑定状态（暂不可用） |

> Email 不在此接口返回，前端从登录返回的 `email` 字段读取，做只读展示。

---

### 2. 更新个人资料

```
PUT /api/profile
```

**需要登录** ✅

**请求体**

```json
{
  "nickname": "新昵称",
  "bio": "新的个人简介"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| nickname | string | ⚠️ | nickname 和 bio **至少传一个** |
| bio | string | ⚠️ | 可为空字符串 |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "nickname": "新昵称",
    "bio": "新的个人简介"
  }
}
```

> 更新成功后前端同步更新 localStorage 中的 nickname。

---

### 3. 修改密码

```
PUT /api/auth/password/change
```

**需要登录** ✅

**请求体**

```json
{
  "current_password": "当前密码",
  "new_password": "新密码"
}
```

| 字段 | 约束 |
|---|---|
| current_password | 必填 |
| new_password | **至少 8 位** |

**成功响应**

```json
{
  "code": 0,
  "message": "Password updated successfully",
  "data": {}
}
```

> 修改成功后不清除登录状态，无需重新登录。

---

### 4. 注销账号

```
DELETE /api/account
```

**需要登录** ✅

**请求体**

```json
{
  "password": "当前密码"
}
```

| 字段 | 说明 |
|---|---|
| password | 当前密码，确认身份 |

**成功响应**

```json
{
  "code": 0,
  "message": "Account has been deactivated",
  "data": {}
}
```

> **逻辑删除**：账号标记为已注销，数据保留但不可登录、不可被公开访问。
> 前端应清除所有本地存储，跳转到首页。

---

## 错误码速查

| code | message | 说明 |
|---|---|---|
| 400 | "Nickname is required" | nickname 传了空值 |
| 400 | "No fields to update" | nickname 和 bio 都没传 |
| 400 | "Current password is incorrect" | 当前密码错误 |
| 400 | "Password is incorrect" | 注销时密码验证失败 |
| 400 | "Account already deactivated" | 账号已注销 |
| 401 | "token invalid / expired" | 未登录或 token 过期 |
| 404 | "User not found" | 用户不存在 |

---

## 前端迁移说明（doxie 专用）

当前 doxie 在用以下旧接口，需要迁移到新接口：

| 功能 | 旧接口 | 新接口 |
|---|---|---|
| 修改昵称 | `PUT /api/auth/profile` | `PUT /api/profile` |
| 修改密码 | `PUT /api/auth/password` | `PUT /api/auth/password/change` |

迁移注意：
- 新接口 `code: 0` 表示成功，旧接口也是 `code: 0`，判断逻辑不变
- 修改密码新接口字段名是 `current_password` / `new_password`（旧的是 `old_password` / `new_password`）
- 修改昵称新接口可同时传 `bio`
