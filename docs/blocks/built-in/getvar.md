---
title: Get Variable Block
---

# Get Variable Block

The Get Variable block retrieves data stored in the request context variables. It allows you to access data that has been previously stored using the Set Variable block or other blocks that modify the context.

## 🎯 Purpose

This block is essential for retrieving data that has been stored in the request context throughout the API workflow. It enables data persistence and sharing between different blocks in your workflow.

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key` | `string` | ✅ | The name of the variable to retrieve |

### Input Schema
```typescript
{
  key: string
}
```

## 🔄 Execution Flow

1. **Key Validation**: Validates that the key parameter is provided
2. **Variable Lookup**: Searches for the variable in the request context
3. **Value Retrieval**: Returns the stored value or null if not found
4. **Output Generation**: Sends the retrieved value to the next block

## 📝 Example Usage

### Basic Variable Retrieval

```json
{
  "key": "userId"
}
```

### Retrieving Complex Data

```json
{
  "key": "userProfile"
}
```

## 🔗 Connections

### Input
- **Target**: Receives input data (not used for variable retrieval)

### Output
- **Source**: Sends the retrieved variable value to the next block
- **Success**: Executes when variable is found and retrieved
- **Error**: Executes when variable is not found or key is invalid

## ⚠️ Error Handling

The block handles several scenarios:

- **Missing Key**: When no key parameter is provided
- **Variable Not Found**: When the specified variable doesn't exist in context
- **Invalid Key**: When key is not a valid string

### Error Response Format
```json
{
  "successful": false,
  "error": "Variable not found or invalid key",
  "continueIfFail": true,
  "output": null
}
```

## 🎨 Use Cases

### User Authentication
```json
// Retrieve authenticated user ID
{
  "key": "authenticatedUserId"
}
```

### Session Management
```json
// Get session data
{
  "key": "sessionData"
}
```

### Data Processing
```json
// Retrieve processed data from previous steps
{
  "key": "processedData"
}
```

### Configuration Values
```json
// Get configuration settings
{
  "key": "apiConfig"
}
```

## 🔧 Best Practices

### Variable Naming
- Use descriptive, consistent variable names
- Follow naming conventions (camelCase, snake_case, etc.)
- Avoid reserved keywords

### Error Handling
- Always check if variable exists before using
- Implement proper error paths for missing variables
- Provide default values when appropriate

### Performance Considerations
- Minimize variable lookups in performance-critical paths
- Cache frequently accessed variables when possible
- Consider variable scope and lifetime

## 🔗 Related Blocks

- **[Set Variable](./setvar.md)**: Store data in context variables
- **[JavaScript Runner](./jsrunner.md)**: Access and manipulate context variables
- **[If](./if.md)**: Make decisions based on variable values
- **[Transformer](./transformer.md)**: Transform variable data

## 📚 API Reference

### Input Schema
```typescript
{
  key: string
}
```

### Output Schema
```typescript
{
  successful: boolean,
  output: any,
  next?: string,
  error?: string,
  continueIfFail: boolean
}
```

### Context Variables

Variables are stored in the request context and can be accessed by any block in the workflow:

```typescript
// Access context variables
this.context.vars['variableName']

// Available context methods
this.context.vars.getQueryParam(key: string): string
this.context.vars.getRouteParam(key: string): string
this.context.vars.getHeader(key: string): string
this.context.vars.setHeader(key: string, value: string): void
this.context.vars.getCookie(key: string): string
this.context.vars.setCookie(name: string, value: any): void
```

## 🔍 Variable Scope

Variables have request-level scope and are available throughout the entire API workflow:

- **Created**: When first set using Set Variable block
- **Accessed**: By any block in the same request
- **Modified**: Can be updated by subsequent blocks
- **Destroyed**: When the request completes

## 🚀 Advanced Usage

### Chaining Variables
```json
// Set multiple related variables
{
  "key": "userPreferences"
}

// Retrieve and process
{
  "key": "userPreferences"
}
```

### Dynamic Variable Names
While direct dynamic variable names aren't supported, you can use JavaScript Runner for complex variable operations:

```javascript
// In JavaScript Runner block
const dynamicKey = `user_${userId}`;
const value = context.vars[dynamicKey];
```

### Variable Validation
```json
// Check if variable exists before processing
{
  "key": "requiredData"
}
// Handle in next blocks based on success/error paths
