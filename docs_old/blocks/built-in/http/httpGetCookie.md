---
title: Get HTTP Cookie Block
---

# Get HTTP Cookie Block

Retrieves cookie values from HTTP requests.

## ⚙️ Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Cookie name |

## 📝 Example

```json
{
  "name": "sessionId"
}
```

## 🎨 Use Cases

- **Session management**: `sessionId=abc123`
- **User preferences**: `theme=dark&lang=en`
- **Authentication**: `authToken=xyz789`

## 📚 API Reference

```typescript
// Input
{
  name: string
}

// Output
{
  successful: boolean,
  output: string,
  next?: string,
  continueIfFail: boolean
}
