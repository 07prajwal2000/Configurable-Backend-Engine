---
title: Get HTTP Request Body Block
---

# Get HTTP Request Body Block

Retrieves and parses the HTTP request body data.

## 🎯 Purpose

This block extracts the body content from HTTP requests, supporting various content types and automatic parsing.

## ⚙️ Configuration

This block requires no configuration parameters.

## 📝 Example Usage

```json
{}
```

## 🔄 Execution Flow

1. **Body Access**: Retrieves raw request body
2. **Content-Type Detection**: Identifies content type
3. **Automatic Parsing**: Parses based on content type
4. **Data Output**: Returns parsed data

## 🎨 Use Cases

### JSON API Requests
```json
// Input: POST /api/users
// Content-Type: application/json
// Body: {"name": "John", "email": "john@example.com"}
//
// Output: { name: "John", email: "john@example.com" }
```

### Form Data
```json
// Input: POST /api/upload
// Content-Type: application/x-www-form-urlencoded
// Body: name=John&email=john@example.com
//
// Output: { name: "John", email: "john@example.com" }
```

### Raw Text
```json
// Input: POST /api/webhook
// Content-Type: text/plain
// Body: "Hello World"
//
// Output: "Hello World"
```

## 📚 API Reference

```typescript
// Input
{} // No parameters required

// Output
{
  successful: boolean,
  output: any,           // Parsed request body
  next?: string,
  continueIfFail: boolean
}
```

## 🔗 Related Blocks

- **[Set Variable](../setvar.md)**: Store request body data
- **[Transformer](../transformer.md)**: Transform body data
- **[JavaScript Runner](../jsrunner.md)**: Process body data
- **[If](../if.md)**: Validate body content
