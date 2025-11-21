---
title: ForEach Loop Block
---

# ForEach Loop Block

The ForEach Loop block provides iteration over array elements, executing a specified block for each item in an array. It's designed for processing collections where you need to perform operations on each element.

## 🎯 Purpose

This block is ideal for scenarios where you need to process each item in a collection or array. It's particularly useful for:

- Processing user lists or data collections
- Validating array elements
- Transforming data structures
- Performing batch operations on multiple items

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `values` | `array` | ✅ | Array of items to iterate over |
| `useParam` | `boolean` | ❌ | Use input parameter as the array |
| `block` | `string` | ❌ | ID of the block to execute for each item |

### Parameter Details

- **`values`**: Static array defined in block configuration
- **`useParam`**: When `true`, uses the input data as the array instead of the configured values
- **`block`**: The block to execute for each array element

## 🔄 Execution Flow

1. **Array Resolution**: Determines whether to use configured values or input parameter
2. **Validation**: Ensures the input is a valid array
3. **Iteration Setup**: Prepares for iteration over array elements
4. **Element Processing**: Executes specified block for each element
5. **Result Collection**: Optionally collects results from each iteration

## 📝 Example Usage

### Static Array Iteration

```json
{
  "values": ["apple", "banana", "cherry"],
  "block": "process-fruit"
}
```

This will execute "process-fruit" block for each fruit in the array.

### Dynamic Array from Parameters

```json
{
  "useParam": true,
  "block": "validate-user"
}
```

Uses the input data as the array to iterate over.

### User Processing

```json
{
  "values": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"},
    {"id": 3, "name": "Bob"}
  ],
  "block": "send-notification"
}
```

Process each user object individually.

## 🔗 Connections

### Input
- **Target**: Receives input data (used as array when `useParam` is true)

### Output
- **Source**: Sends final result after processing all elements
- **Success**: Executes when all iterations complete successfully
- **Error**: Executes if an error occurs during iteration

## 🔄 Iteration Process

### Element Processing
1. **Element Access**: Retrieves current array element
2. **Block Execution**: Executes specified block with element as parameter
3. **Result Handling**: Processes return value from child block
4. **Progress Tracking**: Moves to next element
5. **Completion Check**: Continues until all elements are processed

### Data Flow
- **Element Data**: Current array element passed to child block
- **Element Index**: Available as iteration counter
- **Input Parameters**: Original input data preserved
- **Accumulated Results**: Can be collected across iterations

## 🎨 Use Cases

### User Data Processing

```json
{
  "values": "js:context.vars.userList",
  "block": "update-user-profile"
}
```

Process each user in a stored user list.

### File Processing

```json
{
  "values": ["file1.txt", "file2.txt", "file3.txt"],
  "block": "process-file"
}
```

Process multiple files in sequence.

### API Response Validation

```json
{
  "useParam": true,
  "block": "validate-api-response"
}
```

Validate each item in an API response array.

### Email Notifications

```json
{
  "values": "js:context.vars.subscribers",
  "block": "send-email"
}
```

Send emails to each subscriber in a list.

## 🔧 Best Practices

### Array Validation
- Ensure arrays are not empty before processing
- Validate array element types when necessary
- Handle null/undefined values appropriately

### Error Handling
- Implement error handling in the iterated block
- Use context variables to track processing status
- Consider partial failure scenarios

### Performance Considerations
- Be mindful of array size and processing complexity
- Use efficient algorithms in child blocks
- Consider memory usage for large arrays

### Data Management
- Use context variables to accumulate results
- Track processing progress and statistics
- Clean up temporary data after completion

## 🔗 Related Blocks

- **[For Loop](./for.md)**: Index-based iteration
- **[Set Variable](./setvar.md)**: Store iteration results
- **[Get Variable](./getvar.md)**: Access stored arrays
- **[Array Operations](./arrayops.md)**: Manipulate arrays
- **[JavaScript Runner](./jsrunner.md)**: Complex iteration logic

## 📚 API Reference

### Input Schema
```typescript
{
  values: any[],
  useParam?: boolean,
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

The ForEach block integrates with the execution engine to:

- **Execute Child Blocks**: Run specified blocks for each array element
- **Pass Element Data**: Send current element to child block
- **Handle Errors**: Propagate errors from child block executions
- **Maintain State**: Preserve context across iterations

## 🚀 Advanced Usage

### Nested Data Processing

```json
// Process nested arrays
{
  "values": "js:context.vars.categories.map(cat => cat.items).flat()",
  "block": "process-nested-item"
}
```

### Conditional Processing

```json
// Only process active items
{
  "values": "js:context.vars.items.filter(item => item.active)",
  "block": "process-active-item"
}
```

### Result Aggregation

```json
// Initialize results
{
  "key": "processingResults",
  "value": "js:[]"
}

// Process items
{
  "values": "js:context.vars.items",
  "block": "accumulate-result"
}

// In accumulate-result block:
{
  "key": "processingResults",
  "value": "js:[...context.vars.processingResults, result]"
}
```

### Parallel Processing Simulation

```json
// Process in batches
{
  "values": "js:context.vars.items.slice(0, 10)",
  "block": "process-batch-item"
}
```

## ⚠️ Error Handling

### Common Issues

**Invalid Array Input**
```json
// Problematic: non-array input
{
  "useParam": true,
  "block": "process-item"
}
// Input: "not an array" - will cause error
```

**Empty Arrays**
```json
// Handle empty arrays gracefully
{
  "values": "js:context.vars.items || []",
  "block": "safe-process"
}
```

**Element Processing Errors**
```json
// Implement error boundaries in child blocks
{
  "values": "js:context.vars.unreliableData",
  "block": "robust-processor"
}
```

### Error Recovery Patterns

```json
// Skip failed items
{
  "values": "js:context.vars.items",
  "block": "skip-on-error"
}

// Continue processing despite errors
{
  "values": "js:context.vars.items",
  "block": "continue-on-error"
}
```

## 🔍 Available Variables

### In Child Blocks

- **`params`**: Current array element being processed
- **`i`**: Current iteration index (0-based)
- **Context Variables**: All existing context variables
- **Original Input**: Input data passed to ForEach block

### Example Child Block Usage

```javascript
// Access current element
const currentItem = params;
const itemIndex = i;

// Process the item
const processedItem = processItem(currentItem);

// Store result
context.vars.results = context.vars.results || [];
context.vars.results.push({
  index: itemIndex,
  original: currentItem,
  processed: processedItem
});
```

## 📊 Performance Characteristics

### Time Complexity
- **O(n)**: Linear time based on array length
- **O(n × m)**: Where m is child block complexity

### Memory Usage
- **Minimal**: Only current element stored in memory
- **Configurable**: Results can be streamed or batched

### Optimization Tips
- Process large arrays in chunks
- Use efficient algorithms in child blocks
- Consider async processing for I/O operations
- Monitor memory usage for large datasets

## 🔄 Integration Patterns

### With Array Operations

```json
// Prepare data
{
  "operation": "filter",
  "datasource": "rawData",
  "value": "js:item => item.active"
}

// Process filtered data
{
  "values": "js:context.vars.rawData",
  "block": "process-filtered-item"
}
```

### With Conditional Logic

```json
// Check processing conditions
{
  "conditions": [
    {
      "lhs": "js:context.vars.shouldProcess",
      "rhs": true,
      "operator": "equals"
    }
  ]
}

// Conditional processing
{
  "values": "js:context.vars.shouldProcess ? context.vars.items : []",
  "block": "conditional-process"
}
```

The ForEach Loop block provides flexible array iteration capabilities, making it easy to process collections of data with consistent logic applied to each element.
