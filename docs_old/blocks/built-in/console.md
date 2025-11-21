---
title: Console Log Block
---

# Console Log Block

The Console Log block provides logging functionality for debugging and monitoring API workflows. It outputs messages to the console with different log levels and includes contextual information like timestamps and request paths.

## 🎯 Purpose

This block is designed for development and debugging purposes, allowing you to log messages, variables, and execution flow information to the console. It's particularly useful for:

- Debugging API workflows
- Monitoring execution flow
- Logging important events
- Development and testing

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | `string` | ❌ | Custom message to log (optional) |
| `level` | `enum` | ✅ | Log level: `info`, `warn`, `error` |

### Available Log Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| `info` | General information | Normal operations, milestones |
| `warn` | Warning messages | Non-critical issues, deprecations |
| `error` | Error messages | Failures, exceptions, critical issues |

## 🔄 Execution Flow

1. **Input Validation**: Validates log level and message format
2. **Message Formatting**: Formats message with timestamp, path, and level
3. **JavaScript Evaluation**: Evaluates JavaScript expressions in messages
4. **Console Output**: Outputs formatted message to appropriate console method
5. **Flow Continuation**: Passes input data to next block

## 📝 Example Usage

### Basic Logging

```json
{
  "level": "info",
  "message": "Processing user request"
}
```

### Logging with Variables

```json
{
  "level": "info",
  "message": "User ID: js:context.vars.userId"
}
```

### Error Logging

```json
{
  "level": "error",
  "message": "Failed to process payment"
}
```

### Using Input Parameters

```json
{
  "level": "info"
}
```

When no message is provided, the block will log the input parameters.

## 🔗 Connections

### Input
- **Target**: Receives input data to be logged if no custom message is provided

### Output
- **Source**: Sends input data to next block unchanged
- **Success**: Always executes (logging doesn't fail)
- **Error**: Never executes (block always succeeds)

## 📊 Log Output Format

The block formats log messages with the following structure:

```
LEVEL-PATH-DATE TIME
Message content
```

### Example Output

```
INFO-/api/users-2024-01-15 14:30:25
Processing user registration for: john@example.com

WARN-/api/orders-2024-01-15 14:31:10
Order amount exceeds normal range: 15000

ERROR-/api/payments-2024-01-15 14:32:45
Payment processing failed: Invalid card number
```

## 🎨 Use Cases

### Development Debugging
```json
{
  "level": "info",
  "message": "js:JSON.stringify(context.vars, null, 2)"
}
```

### Request Monitoring
```json
{
  "level": "info",
  "message": "Request received from: js:context.vars.getHeader('User-Agent')"
}
```

### Error Tracking
```json
{
  "level": "error",
  "message": "Database connection failed"
}
```

### Performance Monitoring
```json
{
  "level": "info",
  "message": "js:`Processing completed in: ${Date.now() - context.vars.startTime}ms`"
}
```

## 🔧 Best Practices

### Log Levels
- Use `info` for general information and milestones
- Use `warn` for potential issues that don't stop execution
- Use `error` for failures and exceptions

### Message Content
- Keep messages descriptive but concise
- Include relevant context and identifiers
- Use consistent formatting across your API

### Performance Considerations
- Remove or disable console blocks in production
- Use conditional logic to enable/disable logging
- Avoid logging sensitive information

### JavaScript Expressions
- Use JavaScript expressions for dynamic content
- Ensure expressions are safe and don't throw errors
- Test expressions thoroughly during development

## 🔗 Related Blocks

- **[Set Variable](./setvar.md)**: Store data for logging
- **[Get Variable](./getvar.md)**: Retrieve data to log
- **[JavaScript Runner](./jsrunner.md)**: Complex logging logic
- **[If](./if.md)**: Conditional logging based on conditions

## 📚 API Reference

### Input Schema
```typescript
{
  message?: string,
  level: "info" | "warn" | "error"
}
```

### Output Schema
```typescript
{
  successful: boolean,     // Always true
  output: any,            // Input data unchanged
  next?: string,
  continueIfFail: boolean // Always true
}
```

### Context Integration

The block integrates with the request context to provide:

- **Request Path**: Current API endpoint path
- **Timestamp**: ISO 8601 formatted date and time
- **JavaScript VM**: For evaluating dynamic expressions
- **Context Variables**: Access to stored data

## 🚀 Advanced Usage

### Structured Logging
```json
{
  "level": "info",
  "message": "js:JSON.stringify({
    userId: context.vars.userId,
    action: 'login',
    timestamp: new Date().toISOString(),
    userAgent: context.vars.getHeader('User-Agent')
  }, null, 2)"
}
```

### Conditional Logging
Combine with If blocks for conditional logging:

```json
// If block condition
{
  "conditions": [
    {
      "lhs": "js:context.vars.environment",
      "rhs": "development",
      "operator": "equals"
    }
  ]
}

// Console block (only executes in development)
{
  "level": "info",
  "message": "Debug information"
}
```

### Performance Timing
```json
// Start timing
{
  "level": "info",
  "message": "js:context.vars.startTime = Date.now()"
}

// End timing
{
  "level": "info",
  "message": "js:`Operation completed in: ${Date.now() - context.vars.startTime}ms`"
}
```

## ⚠️ Production Considerations

### Security
- Remove sensitive data from log messages
- Avoid logging passwords, tokens, or PII
- Sanitize user inputs before logging

### Performance
- Logging can impact performance in high-traffic scenarios
- Consider log levels and conditional logging
- Use async logging for better performance

### Monitoring
- Integrate with logging services (CloudWatch, DataDog, etc.)
- Set up log aggregation and analysis
- Monitor error rates and patterns

## 🔍 Troubleshooting

### Common Issues

**Logs not appearing**: Check console output destination and log levels

**JavaScript errors**: Validate JavaScript expressions before deployment

**Performance impact**: Monitor execution times and optimize logging frequency

**Missing context**: Ensure context variables are set before logging

The Console Log block is an essential tool for development and debugging, providing visibility into your API workflows and helping you monitor execution flow and identify issues.
