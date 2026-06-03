# 👍👎 服务赞踩功能 — 前端对接文档

> 为社区服务模块增加赞/踩功能。

---

## 通用规则

- **Header**: `X-App-Code: doxie`
- **需登录接口**: 需携带 `Authorization: Bearer <token>`
- **响应格式**: `{ "code": 0, "message": "success", "data": {} }`

---

## 一、现有接口新增字段

以下三个接口的返回中增加了 `like_count` 和 `dislike_count`：

| 接口 | 新增字段 |
|---|---|
| `GET /api/services`（列表） | `like_count`, `dislike_count` |
| `GET /api/services/mine`（我的列表） | `like_count`, `dislike_count` |
| `GET /api/services/{id}`（详情） | `like_count`, `dislike_count`, **`user_vote`** |

**详情页专属** — `user_vote`

| 值 | 含义 |
|---|---|
| `1` | 当前用户已赞 |
| `-1` | 当前用户已踩 |
| `0` | 当前用户未投票 |

> 未登录时 `user_vote` 始终为 `0`。

---

## 二、新增接口

### 1. 投票 / 改票 / 取消投票

```
POST /api/services/{service_id}/vote
```

**需要登录** ✅

**请求体**

```json
{ "vote": 1 }
```

| vote | 含义 |
|---|---|
| `1` | 赞 |
| `-1` | 踩 |
| `0` | 取消投票 |

**逻辑说明**

| 当前状态 | 传入 vote | 结果 |
|---|---|---|
| 未投过 | `1` | 新增赞，like_count +1 |
| 未投过 | `-1` | 新增踩，dislike_count +1 |
| 已赞 | `1` | 无变化（幂等） |
| 已赞 | `-1` | 改为踩 |
| 已赞 | `0` | 取消赞 |
| 已踩 | `-1` | 无变化（幂等） |
| 已踩 | `1` | 改为赞 |
| 已踩 | `0` | 取消踩 |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "vote": 1,
    "like_count": 10,
    "dislike_count": 2
  }
}
```

前端拿到响应后直接更新页面上的计数即可。

**失败场景**

| code | message | 说明 |
|---|---|---|
| 400 | "Invalid vote value. Must be -1, 0, or 1" | vote 值不合法 |
| 404 | "Service not found" | 服务不存在 |

---

### 2. 查询当前用户投票状态

```
GET /api/services/{service_id}/vote/status
```

**需要登录** ✅

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "vote": 1
  }
}
```

| vote | 含义 |
|---|---|
| `1` | 已赞 |
| `-1` | 已踩 |
| `0` | 未投票 |

---

## 三、前端对接建议

### 详情页

打开详情页时，`GET /api/services/{id}` 已经返回了 `user_vote`，**无需额外调 vote/status**。直接根据 `user_vote` 渲染赞/踩按钮的高亮状态。

用户点击赞/踩 → `POST /api/services/{id}/vote` → 用返回的 `like_count` / `dislike_count` 更新显示。

### 列表页

列表只显示 `like_count` / `dislike_count` 数字，不显示当前用户是否点过赞。用户点进详情页再看状态。

如果列表页也需要显示每个卡片当前用户的投票状态，前端自行遍历调 `GET /api/services/{id}/vote/status`。

---

## 四、防刷说明

| 措施 | 说明 |
|---|---|
| 必须登录 | 匿名不能投票 |
| 每人每服务仅一票 | 数据库 UNIQUE 约束 |
| 可改不可重复投 | 从赞改踩或取消，但只能有一票有效 |
