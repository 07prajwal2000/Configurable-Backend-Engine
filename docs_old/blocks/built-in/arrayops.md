---
title: Array Operations Block
---

# Array Operations Block

The Array Operations block provides essential array manipulation functionality within your API workflows. It allows you to perform common array operations like adding, removing, and modifying elements in arrays stored in the request context.

## 🎯 Purpose

This block is designed to work with arrays stored as variables in the request context. It supports the most commonly used array operations and integrates seamlessly with other blocks in your workflow.

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operation` | `enum` | ✅ | The array operation to perform |
| `value` | `any` | ⚠️ | Value for operations that require input |
| `useParamAsInput` | `boolean` | ❌ | Use input parameter as the value |
| `datasource` | `string` | ✅ | Variable name containing the target array |

### Available Operations

| Operation | Description | Requires Value | Example |
|-----------|-------------|----------------|---------|
| `push` | Add element to end of array | ✅ | `array.push("newItem")` |
| `pop` | Remove last element from array | ❌ | `array.pop()` |
| `shift` | Remove first element from array | ❌ | `array.shift()` |
| `unshift` | Add element to beginning of array | ✅ | `array.unshift("firstItem")` |

## 🔄 Execution Flow

1. **Input Validation**: Validates that the datasource contains a valid array
2. **Operation Execution**: Performs the specified array operation
3. **JavaScript Evaluation**: Evaluates JavaScript expressions for dynamic values
4. **Output Generation**: Returns the modified array as output

## 📝 Example Usage

### Basic Array Operations

```json
{
  "operation": "push",
  "value": "newItem",
  "datasource": "myArray"
}
```

### Using JavaScript Expressions

```json
{
  "operation": "push",
  "value": "js:new Date().toISOString()",
  "datasource": "timestamps"
}
```

### Using Input Parameters

```json
{
  "operation": "push",
  "useParamAsInput": true,
  "datasource": "userList"
}
```

## 🔗 Connections

### Input
- **Target**: Receives input data when `useParamAsInput` is enabled

### Output
- **Source**: Sends the modified array to the next block
- **Success**: Executes when operation completes successfully
- **Error**: Executes when operation fails

## ⚠️ Error Handling

The block handles several error conditions:

- **Invalid Datasource**: When the specified variable is not an array
- **Missing Value**: When a required value is not provided
- **JavaScript Errors**: When JavaScript expressions fail to evaluate

### Error Response Format
```json
{
  "successful": false,
  "error": "datasource is not an array",
  "continueIfFail": false
}
```

## 🎨 Use Cases

### User Management
```json
// Add new user to users array
{
  "operation": "push",
  "value": {"name": "John", "email": "john@example.com"},
  "datasource": "users"
}
```

### Queue Processing
```json
// Remove first item from processing queue
{
  "operation": "shift",
  "datasource": "processingQueue"
}
```

### Data Collection
```json
// Collect form submissions
{
  "operation": "push",
  "useParamAsInput": true,
  "datasource": "formSubmissions"
}
```

## 🔧 Best Practices

### Performance Considerations
- Use appropriate operations for your use case
- Consider array size when performing operations
- Avoid frequent operations on large arrays

### Data Validation
- Always validate array existence before operations
- Check data types when adding elements
- Handle edge cases (empty arrays, etc.)

### Error Handling
- Implement proper error paths in your workflow
- Log errors for debugging purposes
- Provide meaningful error messages

## 🔗 Related Blocks

- **[Set Variable](../built-in/setvar.md)**: Store arrays in context
- **[Get Variable](../built-in/getvar.md)**: Retrieve arrays from context
- **[JavaScript Runner](../built-in/jsrunner.md)**: Advanced array manipulation
- **[ForEach Loop](../built-in/foreach.md)**: Iterate over array elements

## 📚 API Reference

### Input Schema
```typescript
{
  operation: "push" | "pop" | "shift" | "unshift",
  value?: any,
  useParamAsInput?: boolean,
  datasource: string
}
```

### Output Schema
```typescript
{
  successful: boolean,
  output: any[],
  next?: string,
  error?: string,
  continueIfFail: boolean
}
