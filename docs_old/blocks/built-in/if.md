---
title: If Condition Block
---

# If Condition Block

The If Condition block provides conditional branching logic, allowing you to execute different paths based on specified conditions. It supports complex logical expressions with AND/OR operations and JavaScript evaluation.

## 🎯 Purpose

This block enables decision-making in your API workflows, allowing you to:

- Route requests based on conditions
- Validate input data before processing
- Implement business logic rules
- Handle different scenarios dynamically

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conditions` | `array` | ✅ | Array of condition objects to evaluate |

### Condition Object Structure

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `lhs` | `string \| number \| boolean` | ✅ | Left-hand side value |
| `rhs` | `string \| number \| boolean` | ✅ | Right-hand side value |
| `operator` | `string` | ✅ | Comparison operator |
| `js` | `string` | ❌ | JavaScript expression for complex conditions |
| `chain` | `enum` | ❌ | Logical operator for chaining (`and`, `or`) |

## 🔄 Execution Flow

1. **Condition Evaluation**: Evaluates each condition in sequence
2. **Logical Operations**: Applies AND/OR logic between conditions
3. **Result Determination**: Determines if overall condition is true or false
4. **Path Selection**: Routes to success or error path based on result

## 📝 Example Usage

### Simple Equality Check

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.userRole",
      "rhs": "admin",
      "operator": "equals"
    }
  ]
}
```

### Multiple Conditions with AND

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.userAge",
      "rhs": 18,
      "operator": "greaterThan"
    },
    {
      "lhs": "js:context.vars.userStatus",
      "rhs": "active",
      "operator": "equals"
    }
  ]
}
```

### Complex OR Logic

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.userType",
      "rhs": "premium",
      "operator": "equals"
    },
    {
      "lhs": "js:context.vars.purchaseAmount",
      "rhs": 100,
      "operator": "greaterThan"
    }
  ]
}
```

### JavaScript Expressions

```json
{
  "conditions": [
    {
      "lhs": "js:new Date(context.vars.userCreatedAt).getTime()",
      "rhs": "js:Date.now() - (30 * 24 * 60 * 60 * 1000)",
      "operator": "greaterThan",
      "js": "lhs > rhs"
    }
  ]
}
```

## 🔗 Connections

### Input
- **Target**: Receives input data for condition evaluation

### Output
- **Success**: Executes when all conditions evaluate to true
- **Error**: Executes when conditions evaluate to false
- **Next**: Default path (can be configured)

## 🔀 Condition Evaluation

### Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact equality | `userRole == "admin"` |
| `notEquals` | Inequality | `status != "inactive"` |
| `greaterThan` | Greater than | `age > 18` |
| `lessThan` | Less than | `score < 100` |
| `greaterThanOrEqual` | Greater than or equal | `level >= 5` |
| `lessThanOrEqual` | Less than or equal | `count <= 10` |
| `contains` | String contains | `email.includes("@")` |
| `startsWith` | String starts with | `name.startsWith("Mr")` |
| `endsWith` | String ends with | `file.endsWith(".pdf")` |

### Logical Operations

- **AND**: All conditions must be true (default)
- **OR**: At least one condition must be true

### JavaScript Evaluation

Conditions can include JavaScript expressions for complex logic:

```javascript
// Complex date comparison
{
  "lhs": "js:new Date(context.vars.expiryDate)",
  "rhs": "js:new Date()",
  "operator": "greaterThan",
  "js": "lhs.getTime() > rhs.getTime()"
}

// Array membership
{
  "lhs": "js:context.vars.userPermissions",
  "rhs": "write",
  "operator": "contains",
  "js": "Array.isArray(lhs) && lhs.includes(rhs)"
}
```

## 🎨 Use Cases

### User Authorization

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.userRole",
      "rhs": "admin",
      "operator": "equals"
    },
    {
      "lhs": "js:context.vars.isAuthenticated",
      "rhs": true,
      "operator": "equals"
    }
  ]
}
```

### Data Validation

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.email",
      "rhs": "@",
      "operator": "contains"
    },
    {
      "lhs": "js:context.vars.age",
      "rhs": 0,
      "operator": "greaterThan"
    }
  ]
}
```

### Business Rules

```json
{
  "conditions": [
    {
      "lhs": "js:context.vars.orderTotal",
      "rhs": 500,
      "operator": "greaterThan"
    },
    {
      "lhs": "js:context.vars.customerTier",
      "rhs": "gold",
      "operator": "equals"
    }
  ]
}
```

## 🔧 Best Practices

### Condition Design
- Keep conditions simple and readable
- Use descriptive variable names
- Group related conditions logically

### Performance Considerations
- Avoid complex JavaScript expressions when possible
- Cache frequently used computed values
- Consider condition evaluation order

### Error Handling
- Always provide fallback paths
- Log condition evaluation results for debugging
- Handle edge cases and invalid data

### Testing
- Test all possible condition combinations
- Verify edge cases and boundary conditions
- Document expected behavior for each path

## 🔗 Related Blocks

- **[JavaScript Runner](./jsrunner.md)**: Complex conditional logic
- **[Set Variable](./setvar.md)**: Store condition results
- **[Get Variable](./getvar.md)**: Access stored values for conditions
- **[For Loop](./for.md)**: Conditional loop execution
- **[Response](./../response.md)**: Different responses based on conditions

## 📚 API Reference

### Input Schema
```typescript
{
  conditions: Array<{
    lhs: string | number | boolean,
    rhs: string | number | boolean,
    operator: string,
    js?: string,
    chain?: "and" | "or"
  }>
}
```

### Output Schema
```typescript
{
  successful: boolean,
  output: boolean,
  next?: string,
  error?: string,
  continueIfFail: boolean
}
```

### Context Integration

The If block integrates with the request context to:

- **Access Variables**: Read context variables for condition evaluation
- **JavaScript Execution**: Run JavaScript expressions in isolated VM
- **Path Selection**: Route execution based on evaluation results
- **Error Propagation**: Handle and propagate evaluation errors

## 🚀 Advanced Usage

### Nested Conditions

```json
// Complex business logic
{
  "conditions": [
    {
      "lhs": "js:context.vars.userType",
      "rhs": "premium",
      "operator": "equals"
    },
    {
      "lhs": "js:context.vars.accountBalance",
      "rhs": 1000,
      "operator": "greaterThan"
    },
    {
      "lhs": "js:context.vars.subscriptionStatus",
      "rhs": "active",
      "operator": "equals"
    }
  ]
}
```

### Dynamic Condition Building

```json
// Build conditions from configuration
{
  "conditions": "js:context.vars.dynamicConditions.map(cond => ({
    lhs: cond.field,
    rhs: cond.value,
    operator: cond.operator
  }))"
}
```

### Time-Based Conditions

```json
// Time-sensitive logic
{
  "conditions": [
    {
      "lhs": "js:new Date().getHours()",
      "rhs": 9,
      "operator": "greaterThanOrEqual"
    },
    {
      "lhs": "js:new Date().getHours()",
      "rhs": 17,
      "operator": "lessThan"
    }
  ]
}
```

## ⚠️ Error Handling

### Common Issues

**Invalid Operators**
```json
// Problematic: unsupported operator
{
  "lhs": "value",
  "rhs": "test",
  "operator": "invalidOperator"
}
```

**Type Mismatches**
```json
// Problematic: comparing incompatible types
{
  "lhs": "js:context.vars.numberValue",
  "rhs": "string",
  "operator": "equals"
}
```

**JavaScript Errors**
```json
// Problematic: syntax error in JS expression
{
  "lhs": "js:invalid.syntax.here",
  "rhs": "value",
  "operator": "equals"
}
```

### Error Recovery

```json
// Implement error boundaries
{
  "conditions": [
    {
      "lhs": "js:context.vars.safeValue || 'default'",
      "rhs": "expected",
      "operator": "equals"
    }
  ]
}
```

## 🔍 Condition Debugging

### Logging Condition Results

```javascript
// Log condition evaluation
console.log('User role:', context.vars.userRole);
console.log('Is admin:', context.vars.userRole === 'admin');
```

### Step-by-Step Evaluation

```json
// Break complex conditions into steps
{
  "conditions": [
    {
      "lhs": "js:context.vars.step1Result",
      "rhs": true,
      "operator": "equals"
    }
  ]
}
```

The If Condition block provides powerful decision-making capabilities, enabling complex business logic and conditional routing in your API workflows.
