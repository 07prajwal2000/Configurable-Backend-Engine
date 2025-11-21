---
title: Get HTTP Parameter Block
---

# Get HTTP Parameter Block

Extracts route and query parameters from HTTP requests.

## ⚙️ Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Parameter name |
| `source` | `enum` | ✅ | `query` or `path` |

## 📝 Examples

```json
// Query parameter
{
  "name": "search",
  "source": "query"
}

// Route parameter
{
  "name": "userId",
  "source": "path"
}
```

## 🎨 Use Cases

- **Search queries**: `?search=apple&limit=10`
- **Resource IDs**: `/users/{userId}/posts/{postId}`
- **Filtering**: `?status=active&category=tech`

## 📚 API Reference

```typescript
// Input
{
  name: string,
  source: "query" | "path"
}

// Output
{
  successful: boolean,
  output: string,
  next?: string,
  continueIfFail: boolean
}
