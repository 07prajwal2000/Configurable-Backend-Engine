---
title: Set HTTP Header Block
---

# Set HTTP Header Block

The Set HTTP Header block sets header values in HTTP responses. It allows you to control response headers sent back to clients.

## 🎯 Purpose

This block enables you to set HTTP response headers for:

- Content type specification
- CORS configuration
- Authentication challenges
- Custom application headers
- Response metadata

## ⚙️ Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Header name to set |
| `value` | `string` | ✅ | Header value to set |

## 📝 Example Usage

```json
{
  "name": "Content-Type",
  "value": "application/json"
}
```

## 🔄 Execution Flow

1. **Parameter Validation**: Validates header name and value
2. **Header Setting**: Sets header in response
3. **Flow Continuation**: Passes input data unchanged

## 🎨 Use Cases

### Content Type Setting
```json
{
  "name": "Content-Type",
  "value": "application/json"
}
```

### CORS Headers
```json
{
  "name": "Access-Control-Allow-Origin",
  "value": "*"
}
```

### Authentication
```json
{
  "name": "WWW-Authenticate",
  "value": "Bearer realm=\"api\""
}
```

## 📚 API Reference

```typescript
// Input
{
  name: string,
  value: string
}

// Output
{
  successful: boolean,
  output: any,
  next?: string,
  continueIfFail: boolean
}
```

## 🔗 Related Blocks

- **[Get HTTP Header](./httpGetHeader.md)**: Read request headers
- **[Set HTTP Cookie](./httpSetCookie.md)**: Set response cookies
