---
title: Interceptor Block (Internal Use)
---

# Interceptor Block (Internal Use Only)

:::warning
**⚠️ Internal Use Only**

This block is intended for internal framework use and advanced customization. It should not be used in regular API workflows unless you have specific framework-level requirements.

**Not recommended for standard API development.**
:::

## 🎯 Purpose

The Interceptor block provides a low-level hook for intercepting and modifying request execution flow. It allows custom functions to be injected into the execution pipeline for specialized processing, debugging, or framework-level modifications.

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| *(none)* | - | - | No standard configuration parameters |

### Constructor Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `context` | `Context` | ✅ | Request context |
| `next` | `string` | ❌ | Next block ID |
| `fn` | `InterceptorFunction` | ❌ | Custom interceptor function |

## 🔄 Execution Flow

1. **Function Execution**: Executes the provided interceptor function
2. **Context Modification**: Allows modification of request context
3. **Flow Interception**: Can alter execution flow or data
4. **Result Propagation**: Passes modified data to next block

## 📝 Example Usage

### Basic Interceptor

```typescript
import { InterceptorBlock } from "../interceptor";

const interceptor = new InterceptorBlock(
  context,
  "next-block",
  (ctx, params) => {
    // Custom interception logic
    console.log("Intercepting request:", ctx.route);
    // Modify context or parameters
    ctx.vars.intercepted = true;
  }
);
```

### Logging Interceptor

```typescript
const loggingInterceptor = (context, params) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${context.route}:`, params);
};
```

### Authentication Interceptor

```typescript
const authInterceptor = (context, params) => {
  const token = context.vars.getHeader('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  context.vars.authenticated = true;
};
```

## 🔗 Connections

### Input
- **Target**: Receives input data for interception

### Output
- **Source**: Sends potentially modified data to next block
- **Success**: Always executes (interception doesn't fail)
- **Error**: Never executes (block always succeeds)

## 🔧 Interceptor Function

### Function Signature

```typescript
type InterceptorFunction = (context: Context, params?: any) => void;
```

### Parameters

- **`context`**: Full request context with access to:
  - HTTP request data (headers, params, body)
  - Context variables
  - JavaScript VM
  - Route information

- **`params`**: Input data passed from previous block

### Capabilities

- **Read/Write Context**: Full access to context variables and HTTP data
- **Modify Data**: Alter input parameters or context state
- **Throw Errors**: Interrupt execution with custom errors
- **Logging**: Access to console and custom logging
- **External Calls**: Make HTTP requests or database calls

## 🎨 Use Cases

### Framework-Level Features

```typescript
// Request timing
const timingInterceptor = (context) => {
  context.vars.requestStart = Date.now();
};

// Response timing
const responseTimingInterceptor = (context) => {
  const duration = Date.now() - context.vars.requestStart;
  console.log(`Request duration: ${duration}ms`);
};
```

### Custom Middleware

```typescript
// CORS handling
const corsInterceptor = (context) => {
  context.vars.setHeader('Access-Control-Allow-Origin', '*');
  context.vars.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
};
```

### Advanced Logging

```typescript
// Structured logging
const structuredLogger = (context, params) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    route: context.route,
    method: context.httpRequestMethod,
    params: params,
    userAgent: context.vars.getHeader('User-Agent'),
    ip: context.vars.getHeader('X-Forwarded-For')
  };
  // Send to logging service
  sendToLoggingService(logEntry);
};
```

## ⚠️ Important Considerations

### Security Risks
- **Full Context Access**: Can read/write all request data
- **Code Injection**: Custom functions can execute arbitrary code
- **Data Exposure**: Sensitive data might be logged or modified

### Performance Impact
- **Execution Overhead**: Each interceptor adds processing time
- **Blocking Operations**: Synchronous interceptors can slow requests
- **Memory Usage**: Interceptors retain references to context

### Debugging Challenges
- **Invisible Logic**: Interceptors don't appear in visual workflow
- **Side Effects**: Can modify data unexpectedly
- **Error Tracing**: Difficult to trace issues in interceptor code

## 🔧 Best Practices

### Development Guidelines
- **Clear Purpose**: Each interceptor should have a single, clear responsibility
- **Documentation**: Thoroughly document interceptor behavior and side effects
- **Error Handling**: Implement proper error handling and recovery
- **Testing**: Comprehensive testing of interceptor logic

### Security Measures
- **Input Validation**: Validate all inputs and context data
- **Access Control**: Limit sensitive data access
- **Audit Logging**: Log interceptor execution for security monitoring

### Performance Optimization
- **Async Operations**: Use async interceptors for I/O operations
- **Caching**: Cache expensive operations when possible
- **Conditional Execution**: Only execute when necessary

## 🔗 Related Concepts

- **[JavaScript Runner](./jsrunner.md)**: Safer alternative for custom logic
- **[Set Variable](./setvar.md)**: Standard way to modify context
- **[Console Log](./console.md)**: Standard logging approach

## 📚 API Reference

### Constructor
```typescript
constructor(
  context: Context,
  next?: string,
  fn?: InterceptorFunction
)
```

### Execute Method
```typescript
executeAsync(params?: any): Promise<BlockOutput>
```

### Interceptor Function Type
```typescript
type InterceptorFunction = (context: Context, params?: any) => void;
```

### Context Access
```typescript
interface Context {
  vm: JsVM;
  route: string;
  apiId: string;
  vars: ContextVarsType & Record<string, any>;
  requestBody?: any;
}
```

## 🚫 When Not to Use

### Instead of Standard Blocks
```typescript
// ❌ Don't use interceptor for simple variable setting
const badInterceptor = (context) => {
  context.vars.userId = '123';
};

// ✅ Use Set Variable block instead
{
  "key": "userId",
  "value": "123"
}
```

### Instead of Error Handling
```typescript
// ❌ Don't use interceptor for error handling
const errorInterceptor = (context) => {
  if (!context.vars.userId) {
    throw new Error('User not found');
  }
};

// ✅ Use If block with proper error paths
{
  "conditions": [
    {
      "lhs": "js:context.vars.userId",
      "rhs": null,
      "operator": "equals"
    }
  ]
}
```

## 🔧 Framework Integration

### Custom Block Development
```typescript
// Framework-level interceptor for custom blocks
class CustomFrameworkBlock extends BaseBlock {
  constructor(context, config, interceptor) {
    super(context, config.next);
    this.interceptor = interceptor;
  }

  async executeAsync(params) {
    // Pre-processing
    await this.interceptor(this.context, params);

    // Main logic
    const result = await this.process(params);

    // Post-processing
    await this.interceptor(this.context, result);

    return result;
  }
}
```

### Plugin System
```typescript
// Plugin architecture using interceptors
const pluginSystem = {
  interceptors: [],

  register(interceptor) {
    this.interceptors.push(interceptor);
  },

  async execute(context, params) {
    for (const interceptor of this.interceptors) {
      await interceptor(context, params);
    }
  }
};
```

## 📋 Migration Guide

### From Interceptors to Standard Blocks

```typescript
// Old interceptor approach
const oldInterceptor = (context) => {
  const user = context.vars.user;
  if (user.role === 'admin') {
    context.vars.isAdmin = true;
  }
};

// New standard block approach
// 1. Use Get Variable to access user
{
  "key": "user"
}
// 2. Use If block for condition
{
  "conditions": [
    {
      "lhs": "js:context.vars.user.role",
      "rhs": "admin",
      "operator": "equals"
    }
  ]
}
// 3. Use Set Variable for result
{
  "key": "isAdmin",
  "value": true
}
```

## 🎯 Conclusion

The Interceptor block is a powerful but dangerous tool that should only be used when absolutely necessary. For most use cases, standard blocks provide safer, more maintainable, and more visible alternatives. When interceptors are required, ensure they are thoroughly tested, documented, and monitored.

**Recommendation**: Avoid using interceptors unless you have specific framework-level requirements that cannot be satisfied with standard blocks.
