# 📚 知识库模块 — 前端对接文档

> 所有接口统一前缀：`http://127.0.0.1:8000`
> 公开接口：`/api/v1/knowledge/...`
> 管理接口：`/api/v1/admin/knowledge/...`

---

## 通用规则

**Header 必传**

| Header | 必填 | 说明 |
|---|---|---|
| `X-App-Code` | ✅ | 固定传 `doxie` |
| `Authorization` | ⚠️ 管理接口需要 | `Bearer <token>` |

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

## 分类枚举

| code | name |
|---|---|
| `prepare` | 准备养 |
| `new_owner` | 刚开始养 |
| `common` | 常见困惑 |
| `health` | 健康与风险 |
| `practice` | 我的实践记录 |

---

## 公开接口

### 1. 文章列表

```
GET /api/v1/knowledge/articles
```

**不需要登录**

> 列表**不包含**标记为"需登录可见"的文章（`require_login=true`），它们只能通过详情页直接访问。

| 参数 | 必填 | 说明 |
|---|---|---|
| page |  | 页码，默认 `1` |
| page_size |  | 每页条数，默认 `10`，最大 `50` |
| category |  | 筛选分类，不传返回全部 |
| keyword |  | 搜索关键词（匹配标题和摘要） |
| is_featured |  | `true` / `false`，筛选精选 |
| is_hot |  | `true` / `false`，筛选热门 |

> 只返回 `status=1`（已发布）的文章

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "uuid",
        "title": "腊肠犬适合新手吗？",
        "slug": "dachshund-for-beginners",
        "category": "prepare",
        "summary": "腊肠犬性格独立、体型小，适合有耐心养狗的新手...",
        "cover_image": null,
        "source_type": "official",
        "view_count": 128,
        "is_featured": true,
        "is_hot": false,
        "created_at": "2026-04-15T12:00:00+00:00",
        "updated_at": "2026-04-15T12:00:00+00:00"
      }
    ],
    "total": 1,
    "total_page": 1,
    "page": 1,
    "page_size": 10
  }
}
```

> 列表接口**不返回** `content_markdown`（正文），只返回 `summary`（摘要）。

---

### 2. 文章详情（by ID）

```
GET /api/v1/knowledge/articles/{id}
```

**不需要登录**，但部分文章标记为"需登录可见"

> 如果文章设置了 `require_login=true`，未登录用户访问会返回：
> `{ "code": 401, "message": "Login required to view this article" }`
>
> 前端可据此弹登录窗。登录后带 `Authorization: Bearer <token>` 即可正常查看。

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "article": {
      "id": "uuid",
      "title": "腊肠犬适合新手吗？",
      "slug": "dachshund-for-beginners",
      "category": "prepare",
      "summary": "腊肠犬性格独立、体型小，适合有耐心养狗的新手...",
      "content_markdown": "## 腊肠犬的特点\n\n腊肠犬是一种...",
      "cover_image": null,
      "source_type": "official",
      "view_count": 129,
      "is_featured": true,
      "is_hot": false,
      "created_at": "2026-04-15T12:00:00+00:00",
      "updated_at": "2026-04-15T12:00:00+00:00"
    }
  }
}
```

> 详情接口返回完整的 `content_markdown`（Markdown 正文），前端用 Markdown 渲染器展示。

---

### 3. 文章详情（by Slug）

```
GET /api/v1/knowledge/articles/slug/{slug}
```

**不需要登录**，但部分文章标记为"需登录可见"

> 同 ID 详情接口，如果文章设置了 `require_login=true`，未登录用户访问会返回 401。
> 前端可据此弹登录窗。

前端可以用 slug 做路由，如 `/knowledge/dachshund-for-beginners`

> ⚠️ 调用此接口会**自动 +1 阅读数**（`view_count`）。
> ID 接口不会 +1 阅读数，建议前端统一用 slug 接口访问详情页。

**返回结构** 同 ID 详情接口。

---

### 4. 热门文章

```
GET /api/v1/knowledge/articles/hot?limit=10
```

**不需要登录**

返回 `is_hot=true` 的文章列表，按 `sort_order` 排序。

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [ /* 文章列表，同列表结构 */ ]
  }
}
```

---

### 5. 精选文章

```
GET /api/v1/knowledge/articles/featured?limit=10
```

**不需要登录**

返回 `is_featured=true` 的文章列表。

**成功响应** 同热门文章结构。

---

### 6. 最新文章

```
GET /api/v1/knowledge/articles/latest?limit=10
```

**不需要登录**

按 `created_at` 倒序返回最近更新的文章。

**成功响应** 同热门文章结构。

---

### 7. 分类列表

```
GET /api/v1/knowledge/categories
```

**不需要登录**

**成功响应**

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "code": "prepare", "name": "准备养" },
    { "code": "new_owner", "name": "刚开始养" },
    { "code": "common", "name": "常见困惑" },
    { "code": "health", "name": "健康与风险" },
    { "code": "practice", "name": "我的实践记录" }
  ]
}
```

---

## 管理接口

> 以下接口**需要登录**，Header 需携带 `Authorization: Bearer <token>`

### 8. 新增文章

```
POST /api/v1/admin/knowledge/articles
```

**需要登录** ✅

**请求体**

```json
{
  "title": "腊肠犬适合新手吗？",
  "slug": "dachshund-for-beginners",
  "category": "prepare",
  "summary": "腊肠犬性格独立、体型小...",
  "content_markdown": "## 腊肠犬的特点\n\n腊肠犬是一种...",
  "cover_image": null,
  "source_type": "official",
  "status": 1,
  "sort_order": 0,
  "is_featured": true,
  "is_hot": false
}
```

| 字段 | 必填 | 约束 |
|---|---|---|
| title | ✅ | 1-200 字 |
| slug | ✅ | 1-200 字，**全局唯一**（URL 友好标识） |
| category | ✅ | 必须是上述 5 个分类之一 |
| content_markdown | ✅ | Markdown 正文 |
| summary |  | 摘要 |
| cover_image |  | 封面图 URL |
| source_type |  | 默认 `official`，可选 `practice` / `review` / `reference` |
| status |  | 默认 `1`（发布），`0`=草稿，`9`=删除 |
| sort_order |  | 排序权重，越小越靠前 |
| is_featured |  | 是否精选 |
| is_hot |  | 是否热门 |

**source_type 取值**

| 值 | 说明 |
|---|---|
| `official` | 官方整理 |
| `practice` | 我的实践 |
| `review` | 评测 |
| `reference` | 资料整理 |

**status 取值**

| 值 | 说明 |
|---|---|
| `0` | 草稿 |
| `1` | 已发布 |
| `9` | 已删除 |

---

### 9. 修改文章

```
PUT /api/v1/admin/knowledge/articles/{id}
```

**需要登录** ✅

**请求体（全部可选，只传要改的字段）**

```json
{
  "title": "新标题",
  "is_featured": false
}
```

> 如果修改 `slug`，新 slug 不能与其他文章重复。

---

### 10. 删除文章

```
DELETE /api/v1/admin/knowledge/articles/{id}
```

**需要登录** ✅

**逻辑**：软删除，设置 `status = 9`

**成功响应**

```json
{ "code": 0, "message": "success", "data": { "id": "uuid" } }
```

---

## 前端流程建议

### 知识库首页

```
加载分类列表     ──→  加载精选/热门/最新
GET /categories       GET /articles/featured
                      GET /articles/hot
                      GET /articles/latest
```

### 分类浏览

```
点击分类 Tab  ──→  GET /articles?category=prepare&page=1
```

### 搜索

```
输入关键词  ──→  GET /articles?keyword=腊肠&page=1
```

### 详情页

```
打开文章  ──→  GET /articles/slug/{slug}
                (自动记录阅读数)
```

### 管理后台

```
新增 ──→ POST /admin/knowledge/articles
编辑 ──→ PUT  /admin/knowledge/articles/{id}
删除 ──→ DELETE /admin/knowledge/articles/{id}
```

---

## 错误码速查

| code | message | 说明 |
|---|---|---|
| 400 | "Invalid category..." | 分类不存在 |
| 400 | "Invalid source_type..." | source_type 不合法 |
| 400 | "Invalid status..." | status 不是 0/1/9 |
| 400 | "Slug 'xxx' already exists" | slug 已存在 |
| 400 | "No fields to update" | 更新时请求体为空 |
| 401 | "Login required to view this article" | 文章需登录才能查看 |
| 404 | "Article not found" | 文章不存在或已删除 |
