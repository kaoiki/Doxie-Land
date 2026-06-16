# DoxieLand Frontend — Settings 页面接口说明

> 本文档记录 `/settings` 页面用到的所有后端 API 接口。
> 如需调整 Settings 相关接口，请参考此文档。

---

## 基础信息

- **Base URL**: `https://www.heartbeat.cool:2248`
- **Header**: `X-App-Code: doxie`
- **认证**: `Authorization: Bearer <token>`

---

## Settings 页面使用的接口

### 1. 修改昵称

```
PUT /api/auth/profile
```

**请求体**
```json
{ "nickname": "新昵称" }
```

**成功响应**
```json
{ "code": 0, "data": { "nickname": "新昵称" } }
```

**前端行为**: 成功后更新 `localStorage('doxie_nickname')`。

---

### 2. 修改密码

```
PUT /api/auth/password
```

**请求体**
```json
{ "old_password": "当前密码", "new_password": "新密码" }
```

**成功响应**
```json
{ "code": 0, "message": "success" }
```

**前端行为**: 成功后在页面显示 "Password updated successfully" 提示。

---

---

## 🚫 禁止删除或修改的接口

> 以下接口供 `/admin/knowledge` 知识库管理页面使用。
> Settings 调整时 **请不要动这些接口**，否则管理员无法管理知识库文章。

| 接口 | 方法 | 用途 | 页面 |
|---|---|---|---|
| `/api/v1/knowledge/articles` | GET | 获取文章列表（管理页用） | AdminKnowledgeView |
| `/api/v1/admin/knowledge/articles` | POST | 新增文章 | AdminKnowledgeView |
| `/api/v1/admin/knowledge/articles/{id}` | PUT | 修改文章 | AdminKnowledgeView |
| `/api/v1/admin/knowledge/articles/{id}` | DELETE | 删除文章 | AdminKnowledgeView |

### 管理员绑定

管理员 UID（写死在 AdminKnowledgeView.vue 中）：

```
f1ce03a5-4aa5-4531-b096-5798c25cc332
```

此 UID 对应的用户才能在 `/settings` 看到 "Manage Articles" 入口，
并且只有此 UID 能访问 `/admin/knowledge`。

**请勿修改此绑定关系。**

#### 3.1 获取文章列表

```
GET /api/v1/knowledge/articles?page_size=50
```

#### 3.2 新增文章

```
POST /api/v1/admin/knowledge/articles
```

**请求体**
```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "category": "prepare",
  "summary": "摘要",
  "content_markdown": "Markdown 正文",
  "cover_image": null,
  "source_type": "official",
  "status": 1,
  "is_featured": false,
  "is_hot": false,
  "require_login": false
}
```

#### 3.3 修改文章

```
PUT /api/v1/admin/knowledge/articles/{id}
```

#### 3.4 删除文章

```
DELETE /api/v1/admin/knowledge/articles/{id}
```

**前端页面**: `/admin/knowledge` (AdminKnowledgeView.vue)
**管理员 UID 绑定**: `f1ce03a5-4aa5-4531-b096-5798c25cc332`

---

## localStorage 键值对照

| Key | 来源 | 用途 |
|---|---|---|
| `doxie_token` | 登录返回 `data.token` | 认证 Header |
| `doxie_uid` | 登录返回 `data.user_id` | 本地用户标识 |
| `doxie_nickname` | 登录返回 / 修改昵称 | 显示昵称 |
| `doxie_email` | 登录返回 `data.email` | 显示邮箱 |
| `doxie_avatar` | 登录返回 `data.avatar` | 显示头像 |

---

## 管理员配置

管理知识库文章的入口仅对以下 UID 可见：

```
f1ce03a5-4aa5-4531-b096-5798c25cc332
```

非此 UID 的用户在 `/settings` 页面看不到 "Manage Articles" 入口，
直接访问 `/admin/knowledge` 会被重定向回首页。

**此绑定关系请勿修改。**
