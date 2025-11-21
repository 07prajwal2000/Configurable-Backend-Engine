---
title: Set HTTP Cookie Block
---

# Set HTTP Cookie Block

Sets cookie values in HTTP responses with advanced options.

## ⚙️ Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Cookie name |
| `value` | `string \| number` | ✅ | Cookie value |
| `domain` | `string` | ❌ | Cookie domain |
| `path` | `string` | ❌ | Cookie path |
| `expiry` | `string \| Date` | ❌ | Expiration date |
| `httpOnly` | `boolean` | ❌ | HTTP-only flag |
| `secure` | `boolean` | ❌ | Secure flag |
| `samesite` | `enum` | ❌ | SameSite policy |

## 📝 Example

```json
{
  "name": "sessionId",
  "value": "abc123",
  "httpOnly": true,
  "secure": true,
  "samesite": "Strict"
}
```

## 🎨 Use Cases

- **Session management**: Secure session cookies
- **User preferences**: Theme, language settings
- **Authentication**: Auth tokens, refresh tokens

## 📚 API Reference

```typescript
// Input
{
  name: string,
  value: string | number,
  domain?: string,
  path?: string,
  expiry?: string | Date,
  httpOnly?: boolean,
  secure?: boolean,
  samesite?: "Strict" | "Lax" | "None"
}

// Output
{
  successful: boolean,
  output: any,
  next?: string,
  continueIfFail: boolean
}
