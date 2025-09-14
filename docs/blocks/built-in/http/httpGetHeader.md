---
title: Get HTTP Header Block
---

# Get HTTP Header Block

The Get HTTP Header block extracts header values from incoming HTTP requests. It allows you to access standard and custom headers sent by clients in their request.

## 🎯 Purpose

This block is designed to retrieve HTTP header information from requests, which is essential for:

- Authentication and authorization (Bearer tokens, API keys)
- Content negotiation (Accept, Content-Type)
- Client identification (User-Agent, X-Client-ID)
- Request metadata (X-Request-ID, X-Correlation-ID)
- Custom application headers

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Name of the header to retrieve |

### Input Schema
```typescript
{
  name: string
}
```

## 🔄 Execution Flow

1. **Header Name Validation**: Validates that header name is provided
2. **Header Retrieval**: Looks up header value from request
3. **Value Processing**: Returns header value or empty string if not found
4. **Output Generation**: Sends header value to next block

## 📝 Example Usage

### Basic Header Retrieval

```json
{
  "name": "Authorization"
}
```

### Custom Header Access

```json
{
  "name": "X-API-Key"
}
```

### Content Type Checking

```json
{
  "name": "Content-Type"
}
```

## 🔗 Connections

### Input
- **Target**: Receives input data (not used for header retrieval)

### Output
- **Source**: Sends header value to next block
- **Success**: Always executes (header retrieval doesn't fail)
- **Error**: Never executes (block always succeeds)

## 🌐 Common HTTP Headers

### Authentication Headers
| Header | Purpose | Example |
|--------|---------|---------|
| `Authorization` | Bearer tokens, Basic auth | `Bearer eyJ...` |
| `X-API-Key` | API key authentication | `abc123def456` |
| `X-Auth-Token` | Custom auth tokens | `session_12345` |

### Content Headers
| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Request body format | `application/json` |
| `Accept` | Preferred response format | `application/json` |
| `Content-Length` | Request body size | `1024` |

### Client Information
| Header | Purpose | Example |
|--------|---------|---------|
| `User-Agent` | Client application info | `Mozilla/5.0 ...` |
| `X-Client-ID` | Client identifier | `web-app-v2.1` |
| `X-Client-Version` | Client version | `2.1.0` |

### Request Metadata
| Header | Purpose | Example |
|--------|---------|---------|
| `X-Request-ID` | Unique request identifier | `req_12345` |
| `X-Correlation-ID` | Request correlation ID | `corr_67890` |
| `X-Forwarded-For` | Original client IP | `192.168.1.100` |

## 🎨 Use Cases

### Bearer Token Authentication

```json
// Extract Bearer token
{
  "name": "Authorization"
}
// Result: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### API Key Validation

```json
// Get API key from custom header
{
  "name": "X-API-Key"
}
// Result: "sk_live_1234567890abcdef"
```

### Content Negotiation

```json
// Check requested content type
{
  "name": "Accept"
}
// Result: "application/json, text/plain, */*"
```

### Request Tracing

```json
// Get correlation ID for tracing
{
  "name": "X-Correlation-ID"
}
// Result: "550e8400-e29b-41d4-a716-446655440000"
```

### Client Identification

```json
// Identify client application
{
  "name": "X-Client-ID"
}
// Result: "mobile-app-ios"
```

## 🔧 Best Practices

### Header Name Conventions
- Use standard HTTP header names when possible
- Prefix custom headers with `X-` (deprecated but still common)
- Use kebab-case for multi-word header names
- Be consistent across your API

### Security Considerations
- Don't log sensitive header values
- Validate header content before processing
- Use HTTPS to prevent header tampering
- Implement proper authentication checks

### Performance Considerations
- Header access is very fast (no I/O operations)
- Cache frequently accessed header values if needed
- Avoid unnecessary header processing

### Error Handling
- Handle missing headers gracefully
- Provide default values when appropriate
- Validate header format and content

## 🔗 Related Blocks

- **[Set HTTP Header](./httpSetHeader.md)**: Set response headers
- **[Get HTTP Param](./httpGetParam.md)**: Access URL parameters
- **[Get HTTP Cookie](./httpGetCookie.md)**: Access cookie values
- **[Get Request Body](./httpGetRequestBody.md)**: Access request body
- **[If](./../if.md)**: Make decisions based on header values

## 📚 API Reference

### Input Schema
```typescript
{
  name: string
}
```

### Output Schema
```typescript
{
  successful: boolean,     // Always true
  output: string,          // Header value or empty string
  next?: string,
  continueIfFail: boolean // Always true
}
```

### Header Name Rules

- **Case-Insensitive**: `authorization` ≡ `Authorization` ≡ `AUTHORIZATION`
- **Standard Names**: Use registered HTTP header names when possible
- **Custom Names**: Prefix with `X-` for application-specific headers
- **Validation**: Header names should not contain control characters

## 🚀 Advanced Usage

### Multi-Value Headers

```json
// Handle headers with multiple values
{
  "name": "Accept"
}
// Result: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
```

### Header Parsing

```json
// Parse complex header values
{
  "name": "Authorization"
}
// Use JavaScript Runner to parse:
// const auth = params;
// if (auth.startsWith('Bearer ')) {
//   return auth.substring(7); // Extract token
// }
```

### Header Validation

```json
// Validate required headers
{
  "name": "Authorization"
}
// Use If block to check:
// {
//   "conditions": [
//     {
//       "lhs": "js:params && params.startsWith('Bearer ')",
//       "rhs": true,
//       "operator": "equals"
//     }
//   ]
// }
```

### Header Normalization

```json
// Normalize header values
{
  "name": "content-type"
}
// Use JavaScript Runner to normalize:
// return params ? params.toLowerCase() : 'application/json';
```

## ⚠️ Security Considerations

### Sensitive Headers
- **Authorization**: Contains authentication credentials
- **Cookie**: May contain session data
- **X-API-Key**: Contains API access keys
- **X-Auth-Token**: Contains authentication tokens

### Best Practices
```javascript
// Safe header logging
const headerValue = getHeader('Authorization');
if (headerValue) {
  // Log only the type, not the value
  console.log('Auth header present:', headerValue.split(' ')[0]);
}
```

### Input Validation
```javascript
// Validate header content
const apiKey = getHeader('X-API-Key');
if (!apiKey || apiKey.length < 10) {
  throw new Error('Invalid API key');
}
```

## 🔍 Debugging

### Header Inspection

```javascript
// Log all headers (for debugging only)
console.log('All headers:', context.vars);

// Log specific header
const userAgent = getHeader('User-Agent');
console.log('User Agent:', userAgent);
```

### Header Existence Check

```javascript
// Check if header exists
const hasAuth = !!getHeader('Authorization');
console.log('Has auth header:', hasAuth);
```

### Header Value Analysis

```javascript
// Analyze header content
const contentType = getHeader('Content-Type');
console.log('Content type:', contentType);
console.log('Is JSON:', contentType?.includes('json'));
```

## 📊 Common Patterns

### Authentication Flow
```json
// 1. Get auth header
{
  "name": "Authorization"
}
// 2. Extract token (JavaScript Runner)
// 3. Validate token (external API call)
// 4. Set user context (Set Variable)
```

### API Versioning
```json
// Check API version
{
  "name": "Accept-Version"
}
// Default to v1 if not specified
```

### Rate Limiting
```json
// Get client identifier
{
  "name": "X-Client-ID"
}
// Use for rate limiting logic
```

The Get HTTP Header block provides essential access to HTTP request headers, enabling authentication, content negotiation, request tracing, and custom application logic based on client-provided metadata.
