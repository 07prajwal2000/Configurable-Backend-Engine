---
title: For Loop Block
---

# For Loop Block

The For Loop block provides traditional looping functionality with configurable start, end, and step values. It allows you to execute a sequence of blocks repeatedly for a specified number of iterations.

## 🎯 Purpose

This block is designed for scenarios where you need to perform repetitive operations a specific number of times. It's particularly useful for:

- Processing arrays with known indices
- Generating sequences of data
- Performing batch operations
- Implementing countdowns or counters

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start` | `number` \| `string` | ✅ | Starting value of the loop |
| `end` | `number` \| `string` | ✅ | Ending value (exclusive) |
| `step` | `number` \| `string` | ❌ | Increment value (default: 1) |
| `block` | `string` | ❌ | ID of the block to execute in each iteration |

### Parameter Types

- **Numbers**: Direct numeric values (`10`, `0`, `2`)
- **Strings**: JavaScript expressions prefixed with `js:` (`js:i * 2`, `js:context.vars.maxValue`)

## 🔄 Execution Flow

1. **Parameter Evaluation**: Evaluates start, end, and step values
2. **Loop Initialization**: Sets up the loop counter
3. **Iteration Execution**: Runs the specified block for each iteration
4. **Counter Update**: Increments counter by step value
5. **Termination Check**: Continues until counter reaches end value

## 📝 Example Usage

### Basic Numeric Loop

```json
{
  "start": 0,
  "end": 10,
  "step": 1,
  "block": "process-item"
}
```

This will execute the "process-item" block 10 times (iterations 0 through 9).

### Loop with Custom Step

```json
{
  "start": 0,
  "end": 100,
  "step": 10,
  "block": "batch-process"
}
```

This will execute every 10th iteration: 0, 10, 20, ..., 90.

### Dynamic End Value

```json
{
  "start": 1,
  "end": "js:context.vars.itemCount",
  "step": 1,
  "block": "validate-item"
}
```

The end value is determined dynamically from a context variable.

### JavaScript Expressions

```json
{
  "start": "js:context.vars.startIndex",
  "end": "js:context.vars.startIndex + 5",
  "step": "js:Math.max(1, context.vars.stepSize)",
  "block": "calculate-result"
}
```

All parameters can use JavaScript expressions for dynamic values.

## 🔗 Connections

### Input
- **Target**: Receives input data passed to each iteration

### Output
- **Source**: Sends the final result after all iterations complete
- **Success**: Executes when loop completes successfully
- **Error**: Executes if loop encounters an error

## 🔄 Loop Execution

### Iteration Process
1. **Counter Check**: Verify if current counter is less than end value
2. **Block Execution**: Execute the specified block with current counter value
3. **Result Collection**: Optionally collect results from each iteration
4. **Counter Increment**: Add step value to counter
5. **Repeat**: Continue until termination condition is met

### Data Flow
- **Input Data**: Passed to each iteration of the child block
- **Iteration Value**: Current counter value available as `i` parameter
- **Result Accumulation**: Results can be collected in context variables

## 🎨 Use Cases

### Array Processing by Index

```json
{
  "start": 0,
  "end": "js:context.vars.items.length",
  "step": 1,
  "block": "process-array-item"
}
```

Process each element of an array by its index.

### Batch Operations

```json
{
  "start": 0,
  "end": "js:Math.ceil(context.vars.totalRecords / 100)",
  "step": 1,
  "block": "process-batch"
}
```

Process records in batches of 100.

### Countdown Timer

```json
{
  "start": 10,
  "end": 0,
  "step": -1,
  "block": "update-timer"
}
```

Create a countdown from 10 to 0.

### Data Generation

```json
{
  "start": 1,
  "end": 101,
  "step": 1,
  "block": "generate-report"
}
```

Generate reports for items 1 through 100.

## 🔧 Best Practices

### Performance Considerations
- Keep loop bodies lightweight
- Avoid deep nesting of loops
- Consider memory usage for large iteration counts
- Use appropriate step sizes to reduce iterations

### Error Handling
- Implement error handling in the looped block
- Use context variables to track loop progress
- Handle edge cases (empty ranges, invalid parameters)

### Variable Management
- Use context variables to accumulate results
- Track loop progress and status
- Clean up temporary variables after completion

### JavaScript Expressions
- Validate expressions before deployment
- Ensure expressions don't have side effects
- Use context variables for complex calculations

## 🔗 Related Blocks

- **[ForEach Loop](./foreach.md)**: Iterate over array elements
- **[Set Variable](./setvar.md)**: Store loop results
- **[Get Variable](./getvar.md)**: Access loop data
- **[JavaScript Runner](./jsrunner.md)**: Complex loop logic
- **[Array Operations](./arrayops.md)**: Manipulate arrays within loops

## 📚 API Reference

### Input Schema
```typescript
{
  start: number | string,
  end: number | string,
  step?: number | string,
  block?: string
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

### Context Integration

The loop block integrates with the execution engine to:

- **Execute Child Blocks**: Run specified blocks for each iteration
- **Pass Parameters**: Send current counter value to child blocks
- **Handle Errors**: Propagate errors from child block executions
- **Maintain State**: Preserve context across iterations

## 🚀 Advanced Usage

### Nested Loops

```json
// Outer loop
{
  "start": 0,
  "end": 3,
  "block": "inner-loop-setup"
}

// Inner loop (called from outer)
{
  "start": 0,
  "end": "js:context.vars.innerCount",
  "block": "process-matrix-item"
}
```

### Dynamic Loop Control

```json
{
  "start": "js:context.vars.currentPosition",
  "end": "js:context.vars.targetPosition",
  "step": "js:context.vars.direction === 'forward' ? 1 : -1",
  "block": "move-position"
}
```

### Result Accumulation

```json
// Initialize results array
{
  "key": "loopResults",
  "value": "js:[]"
}

// Loop configuration
{
  "start": 0,
  "end": 10,
  "block": "accumulate-result"
}

// In the accumulate-result block:
{
  "key": "loopResults",
  "value": "js:[...context.vars.loopResults, `Result ${i}`]"
}
```

### Conditional Loop Execution

```json
// Only execute if condition is met
{
  "start": "js:context.vars.shouldLoop ? 0 : 1",
  "end": "js:context.vars.shouldLoop ? context.vars.loopCount : 1",
  "block": "conditional-process"
}
```

## ⚠️ Error Handling

### Common Issues

**Infinite Loops**: Ensure end condition is reachable
```json
// Problematic: step is 0 or wrong direction
{
  "start": 0,
  "end": 10,
  "step": 0  // Will cause infinite loop
}
```

**Invalid Parameters**: Validate input values
```json
// Problematic: start > end with positive step
{
  "start": 10,
  "end": 0,
  "step": 1  // Will never execute
}
```

**JavaScript Errors**: Handle expression failures
```json
// Problematic: undefined variable
{
  "end": "js:context.vars.undefinedVar.length"  // Will throw error
}
```

### Error Recovery

```json
// Implement error boundaries
{
  "start": 0,
  "end": "js:context.vars.safeEnd || 10",
  "step": 1,
  "block": "safe-operation"
}
```

## 🔍 Loop Variables

### Available in Child Blocks

- **`i`**: Current iteration counter
- **`params`**: Input data passed to the loop
- **Context Variables**: All existing context variables

### Example Child Block Usage

```javascript
// Access loop counter
const currentIndex = i;

// Access input data
const inputData = params;

// Store iteration result
context.vars.results = context.vars.results || [];
context.vars.results.push(`Iteration ${i}: ${inputData}`);
```

The For Loop block provides powerful iteration capabilities, allowing you to execute blocks repeatedly with precise control over the iteration process and access to loop state.
