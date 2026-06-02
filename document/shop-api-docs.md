# 🛒 Shop 评测模块 — 前端对接文档

> 所有接口统一前缀：`http://127.0.0.1:8000`
> Content-Type: `application/json`（图片上传除外）

---

## 通用规则

**Header 必传**

| Header | 必填 | 说明 |
|---|---|---|
| `X-App-Code` | ✅ | 固定传 `doxie` |

**统一响应格式**

```json
{ "code": 0, "message": "success", "data": {} }
```

**分页返回结构**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "total": 10,
    "total_page": 1,
    "page": 1,
    "page_size": 10
  }
}
```

---

## 一、评测帖 CRUD

### 1.1 创建评测帖

```
POST /api/shop/reviews
```

**请求体**

```json
{
  "title": "耳机评测",
  "content": "这款耳机音质很好...",
  "user_id": "用户ID"
}
```

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "title": "耳机评测",
    "content": "这款耳机音质很好...",
    "user_id": "用户ID",
    "app_code": "doxie",
    "cover_image": null,
    "status": 0,
    "join_count": 0,
    "is_deleted": false,
    "created_at": "2026-04-15T12:00:00+00:00",
    "updated_at": "2026-04-15T12:00:00+00:00"
  }
}
```

---

### 1.2 获取评测列表

```
GET /api/shop/reviews?page=1&page_size=10
```

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "uuid",
        "title": "耳机评测",
        "content": "这款耳机音质很好...",
        "status": 0,
        "join_count": 5,
        "image_count": 2,
        "created_at": "2026-04-15T12:00:00+00:00",
        "user_id": "用户ID"
      }
    ],
    "total": 10,
    "total_page": 1,
    "page": 1,
    "page_size": 10
  }
}
```

| 返回字段 | 类型 | 说明 |
|---|---|---|
| status | int | `0` = 未开团（默认），`1` = 已开团 |
| join_count | int | 当前 join 人数 |
| image_count | int | 该评测的图片数量 |

---

### 1.3 获取评测详情

```
GET /api/shop/reviews/{review_id}
```

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "review": {
      "id": "uuid",
      "title": "耳机评测",
      "content": "这款耳机音质很好...",
      "status": 0,
      "join_count": 5,
      "images": [
        { "id": "img-uuid", "path": "reviews/xxx/yyy.jpg", "url": "https://xxx.supabase.co/..." }
      ],
      "image_count": 1,
      "created_at": "2026-04-15T12:00:00+00:00",
      "user_id": "用户ID"
    }
  }
}
```

> `images` 数组里的 `url` 可以直接放在 `<img>` 标签中展示。

---

### 1.4 删除评测帖

```
DELETE /api/shop/reviews/{review_id}
```

**成功响应**

```json
{ "code": 0, "message": "success", "data": { "id": "uuid" } }
```

---

## 二、图片上传 / 删除

### 2.1 上传图片

```
POST /api/shop/reviews/{review_id}/images
```

> ⚠️ 此接口使用 **form-data**（不是 JSON）

| 表单字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| user_id | text | ✅ | 发帖人用户 ID |
| files | file[] | ✅ | 可一次传多张，**每篇评测最多4张** |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "images": [
      { "id": "img-uuid", "path": "reviews/xxx/yyy.jpg", "url": "https://xxx.supabase.co/..." },
      { "id": "img-uuid2", "path": "reviews/xxx/zzz.jpg", "url": "https://xxx.supabase.co/..." }
    ],
    "image_count": 2
  }
}
```

---

### 2.2 删除单张图片

```
DELETE /api/shop/reviews/{review_id}/images/{image_id}?user_id=用户ID
```

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "images": [ /* 剩余的图片列表 */ ],
    "image_count": 1
  }
}
```

---

## 三、Join / Unjoin（需要登录）

> 以下两个接口**需要登录 token**，Header 中额外传：
> `Authorization: Bearer <登录返回的token>`

### 3.1 Join / Unjoin 切换

```
POST /api/shop/reviews/{review_id}/join
```

**逻辑**

| 当前状态 | 调用后 |
|---|---|
| 未 join | 加入 join，count +1 |
| 已 join | 取消 join，count -1 |

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "joined": true,
    "join_count": 6
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| joined | bool | `true` = 已加入，`false` = 已取消 |
| join_count | int | 当前总 join 人数 |

---

### 3.2 查询是否已 join

```
GET /api/shop/reviews/{review_id}/join/status
```

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "joined": true
  }
}
```

可用于页面加载时判断是否显示"已加入"状态。

---

## 四、开团状态说明

**`status` 字段定义**

| 值 | 说明 |
|---|---|
| `0` | 未开团（默认） |
| `1` | 已开团 |

**开团操作由后台手动修改数据库**，前端无需做开团功能。前端只需要：
- 根据 `status` 显示对应文案（如 "未开团" / "已开团"）
- 根据 `join_count` 显示参与人数

---

## 五、前端对接流程示例

### 发帖流程

```
创建评测帖  ──→  上传图片  ──→  跳转详情页
POST /reviews      POST /reviews/{id}/images
```

### 浏览流程

```
进入列表页     ──→   点进详情页
GET /reviews         GET /reviews/{id}
(分页数据)           (含图片列表)
```

### 用户交互

```
页面加载                ──→   查询是否已 join
GET /join/status

用户点击 Join 按钮      ──→   POST /join
(切换状态)                    (返回新 joined + count)
```

---

## 六、错误码速查

| HTTP | message | 说明 |
|---|---|---|
| 200 (code=404) | review not found | 评测帖不存在或已删除 |
| 200 (code=403) | forbidden | 不是发帖人，无法操作图片 |
| 200 (code=400) | maximum 4 images per review | 图片超过4张上限 |
| 200 (code=400) | image not found | 要删除的图片不存在 |
| 200 (code=401) | token invalid / token expired | token 无效或过期 |
| 200 (code=403) | user is frozen / canceled | 账号被冻结或注销 |
