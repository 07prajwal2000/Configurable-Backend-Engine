---
title: Request Context & Variables
---

# Request Context & Variables

The request context is the central data structure that holds all information about an API request throughout its lifecycle. It provides access to HTTP data, custom variables, and utility functions that can be used by any block in your workflow.

## 🏗️ Context Architecture

The context consists of several key components:

- **HTTP Data**: Request parameters, headers, body, and metadata
- **Custom Variables**: User-defined data stored during workflow execution
- **Utility Functions**: Helper methods for common operations
- **JavaScript VM**: Isolated execution environment for custom code

## 🌐 HTTP Context Data

### Request Information
| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `httpRequestMethod` | `string` | HTTP method | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` |
| `httpRequestRoute` | `string` | Request path | `"/api/users/123"` |
| `httpRequestQuery` | `object` | Query parameters | `{search: "john", limit: "10"}` |

### Request Data Access
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getQueryParam(key)` | `string` | `string` | Get query parameter value |
| `getRouteParam(key)` | `string` | `string` | Get route parameter value |
| `getHeader(key)` | `string` | `string` | Get request header value |
| `getCookie(key)` | `string` | `string` | Get cookie value |
| `getRequestBody()` | `any` | Request body data | Parse and return request body |

### Response Manipulation
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setHeader(key, value)` | `string`, `string` | `void` | Set response header |
| `setCookie(name, options)` | `string`, `object` | `void` | Set response cookie |

## 💾 Custom Variables

Variables allow you to store and retrieve data throughout the request lifecycle:

### Variable Operations
```javascript
// Store data (globally accessible)
userId = 123;
userProfile = { name: 'John', email: 'john@example.com' };

// Retrieve data (globally accessible)
const currentUserId = userId;
const profile = userProfile;
```

### Variable Scope
- **Request-level**: Variables persist throughout the entire request
- **Block-accessible**: Any block can read/write variables
- **Type-flexible**: Store any JavaScript data type

## 🔧 JavaScript VM Integration

The context includes an isolated JavaScript VM for executing custom code:

```javascript
// Access context data in JavaScript blocks (globally accessible)
const userId = userData;  // Variables are globally accessible
const searchTerm = getQueryParam('search');
const authToken = getHeader('Authorization');

// Perform operations
const processedData = {
  id: userId,
  search: searchTerm,
  timestamp: new Date().toISOString()
};

// Store result (globally accessible)
processedResult = processedData;
```

## 📝 Usage Examples

### Basic Data Extraction
```javascript
// Extract user ID from route parameter
const userId = getRouteParam('userId');

// Get search query from URL parameters
const searchQuery = getQueryParam('search');

// Retrieve authentication token
const authToken = getHeader('Authorization');

// Parse request body
const requestData = getRequestBody();
```

### Response Configuration
```javascript
// Set response headers
setHeader('Content-Type', 'application/json');
setHeader('Cache-Control', 'no-cache');

// Set cookies
setCookie('sessionId', {
  value: 'abc123',
  httpOnly: true,
  secure: true,
  maxAge: 3600
});
```

### Variable Management
```javascript
// Store user data (globally accessible)
currentUser = {
  id: getRouteParam('userId'),
  authenticated: true,
  permissions: ['read', 'write']
};

// Process data (globally accessible)
const user = currentUser;
const canWrite = user.permissions.includes('write');

// Store processing result (globally accessible)
processingComplete = true;
```

## 🔗 Context in Blocks

### Accessing Context in Custom Blocks
```typescript
import { BaseBlock, BlockOutput } from "../baseBlock";

export class CustomBlock extends BaseBlock {
  async executeAsync(params?: any): Promise<BlockOutput> {
    // Access context data (globally accessible in JavaScript blocks)
    // Note: In custom TypeScript blocks, use this.context.vars
    const userId = this.context.vars.userId;
    const searchParam = this.context.vars.getQueryParam('search');

    // Perform operations
    const result = processData(userId, searchParam);

    return {
      successful: true,
      output: result,
      next: this.next
    };
  }
}
```

### JavaScript Runner Block
```javascript
// Full context access in JavaScript blocks
const userId = getRouteParam('userId');
const search = getQueryParam('search');
const body = getRequestBody();

// Complex processing
const result = await fetch(`/api/users/${userId}`)
  .then(res => res.json())
  .then(user => ({
    ...user,
    searchTerm: search,
    processedAt: new Date().toISOString()
  }));

// Store result
context.vars.apiResult = result;

// Set response
setHeader('X-Processed-By', 'ConfigurableBackend');
```

## 🔒 Security Considerations

### Input Validation
- Always validate input parameters before use
- Sanitize data from external sources
- Use parameterized queries for database operations

### Variable Safety
- Avoid storing sensitive data in variables
- Clear sensitive variables after use
- Validate variable data types

### JavaScript Execution
- JavaScript code runs in isolated VM
- Limited access to Node.js APIs
- Timeout protection for long-running scripts

## 🚀 Advanced Patterns

### Context Sharing Between Blocks
```javascript
// Block 1: Extract and validate data
const userId = getRouteParam('userId');
if (!userId || !/^\d+$/.test(userId)) {
  throw new Error('Invalid user ID');
}
validatedUserId = parseInt(userId);  // Globally accessible

// Block 2: Use validated data
const userId = validatedUserId;  // Globally accessible
// Safe to use - already validated
```

### Conditional Processing
```javascript
// Check authentication
const authHeader = getHeader('Authorization');
if (authHeader && authHeader.startsWith('Bearer ')) {
  authenticated = true;  // Globally accessible
  token = authHeader.substring(7);  // Globally accessible
} else {
  authenticated = false;  // Globally accessible
}

// Later blocks can check authentication status
if (!authenticated) {  // Globally accessible
  setHeader('WWW-Authenticate', 'Bearer');
  // Return 401 response
}
```

### Data Transformation Pipeline
```javascript
// Block 1: Parse input
const rawData = getRequestBody();
rawInput = rawData;  // Globally accessible

// Block 2: Validate and clean
const cleaned = validateAndClean(rawInput);  // Globally accessible
cleanedData = cleaned;  // Globally accessible

// Block 3: Transform
const transformed = transformData(cleanedData);  // Globally accessible
finalResult = transformed;  // Globally accessible

// Block 4: Format response
const response = formatResponse(finalResult);  // Globally accessible
// Return via Response block
```

## 📚 API Reference

### Context Interface
```typescript
interface Context {
  vm: JsVM;
  route: string;
  apiId: string;
  vars: ContextVarsType & Record<string, any>;
  requestBody?: any;
}
```

### ContextVarsType Methods
```typescript
interface ContextVarsType {
  getQueryParam(key: string): string;
  getRouteParam(key: string): string;
  getHeader(key: string): string;
  setHeader(key: string, value: string): void;
  getCookie(key: string): string;
  setCookie(name: string, value: any): void;
  httpRequestMethod: string;
  httpRequestRoute: string;
  getRequestBody(): any;
}
```

## 🔗 Related Topics

- **[JavaScript Runner Block](../blocks/built-in/jsrunner.md)**: Execute custom JavaScript with full context access
- **[Set Variable Block](../blocks/built-in/setvar.md)**: Store data in context variables
- **[Get Variable Block](../blocks/built-in/getvar.md)**: Retrieve data from context variables
- **[HTTP Blocks](../blocks/built-in/http/)**: Access HTTP request/response data
