---
title: Transformer Block
---

# Transformer Block

The Transformer block provides powerful data transformation capabilities using field mapping. It allows you to restructure, rename, and reorganize data objects by defining mapping rules between input and output fields.

## 🎯 Purpose

This block is designed for data transformation scenarios where you need to:

- Restructure API responses to match client expectations
- Rename fields for consistency
- Extract nested data into flat structures
- Transform data formats between systems
- Prepare data for downstream processing

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fieldMap` | `object` | ✅ | Mapping of output fields to input expressions |
| `useJs` | `boolean` | ❌ | Enable JavaScript mode for complex transformations |
| `js` | `string` | ⚠️ | JavaScript code when useJs is true |

### Field Mapping Format

```json
{
  "fieldMap": {
    "outputField1": "inputField1",
    "outputField2": "inputField2.nestedField",
    "outputField3": "js:transformFunction(inputField3)"
  }
}
```

## 🔄 Execution Flow

1. **Input Validation**: Validates field mapping and input data
2. **Mode Selection**: Chooses between mapping mode or JavaScript mode
3. **Field Processing**: Processes each field according to mapping rules
4. **JavaScript Evaluation**: Evaluates JavaScript expressions when needed
5. **Output Construction**: Builds transformed output object

## 📝 Example Usage

### Basic Field Mapping

```json
{
  "fieldMap": {
    "userId": "id",
    "fullName": "name",
    "emailAddress": "contact.email",
    "accountStatus": "status"
  }
}
```

Input:
```json
{
  "id": 123,
  "name": "John Doe",
  "contact": {
    "email": "john@example.com",
    "phone": "555-0123"
  },
  "status": "active"
}
```

Output:
```json
{
  "userId": 123,
  "fullName": "John Doe",
  "emailAddress": "john@example.com",
  "accountStatus": "active"
}
```

### JavaScript Transformations

```json
{
  "useJs": true,
  "js": "return { ...params, computedField: params.value * 2, timestamp: new Date().toISOString() }"
}
```

### Complex Mapping with Expressions

```json
{
  "fieldMap": {
    "id": "user.id",
    "displayName": "js:`${params.user.firstName} ${params.user.lastName}`",
    "isActive": "js:params.user.status === 'active'",
    "profileUrl": "js:`/users/${params.user.id}/profile`",
    "tags": "user.tags",
    "lastLogin": "activity.lastLogin"
  }
}
```

## 🔗 Connections

### Input
- **Target**: Receives input data object to transform

### Output
- **Source**: Sends transformed data to next block
- **Success**: Executes when transformation completes successfully
- **Error**: Executes when transformation fails

## 🔀 Transformation Modes

### Field Mapping Mode (Default)

- Uses dot notation for nested field access
- Supports JavaScript expressions with `js:` prefix
- Maintains original data types
- Validates field existence

### JavaScript Mode

- Executes custom JavaScript code
- Full access to input data as `params`
- Complete control over output structure
- Supports complex transformations

## 🎨 Use Cases

### API Response Normalization

```json
// Transform external API response to internal format
{
  "fieldMap": {
    "id": "external_id",
    "name": "full_name",
    "email": "contact_info.email",
    "createdAt": "registration_date",
    "isVerified": "verification_status"
  }
}
```

### Data Flattening

```json
// Flatten nested structure
{
  "fieldMap": {
    "userId": "user.id",
    "userName": "user.name",
    "companyName": "user.company.name",
    "companyId": "user.company.id",
    "role": "user.role"
  }
}
```

### Computed Fields

```json
// Add computed fields
{
  "fieldMap": {
    "id": "id",
    "name": "name",
    "fullAddress": "js:`${params.street}, ${params.city}, ${params.country}`",
    "isAdult": "js:params.age >= 18",
    "category": "js:getCategory(params.score)",
    "processedAt": "js:new Date().toISOString()"
  }
}
```

### Data Filtering

```json
// Filter and transform data
{
  "fieldMap": {
    "activeUsers": "js:params.users.filter(u => u.status === 'active')",
    "totalUsers": "js:params.users.length",
    "adminUsers": "js:params.users.filter(u => u.role === 'admin')",
    "userNames": "js:params.users.map(u => u.name)"
  }
}
```

## 🔧 Best Practices

### Field Mapping
- Use descriptive output field names
- Validate input data structure before mapping
- Handle optional fields gracefully
- Use consistent naming conventions

### JavaScript Expressions
- Keep expressions simple and readable
- Test expressions thoroughly
- Handle edge cases and null values
- Use helper functions for complex logic

### Performance Considerations
- Avoid complex computations in mappings
- Cache expensive operations when possible
- Minimize JavaScript execution for high-volume requests
- Profile transformation performance

### Error Handling
- Validate input data before transformation
- Provide meaningful error messages
- Handle missing or malformed data
- Use fallback values for optional fields

## 🔗 Related Blocks

- **[JavaScript Runner](./jsrunner.md)**: Alternative for complex transformations
- **[Set Variable](./setvar.md)**: Store transformation results
- **[Get Variable](./getvar.md)**: Access data for transformation
- **[Array Operations](./arrayops.md)**: Transform array data
- **[If](./if.md)**: Conditional transformations

## 📚 API Reference

### Input Schema
```typescript
{
  fieldMap?: Record<string, string>,
  useJs?: boolean,
  js?: string
}
```

### Output Schema
```typescript
{
  successful: boolean,
  output: any,           // Transformed data object
  next?: string,
  error?: string,        // Error message if transformation fails
  continueIfFail: boolean
}
```

### Field Mapping Syntax

#### Dot Notation
```javascript
// Access nested properties
"user.name"        // params.user.name
"user.company.name" // params.user.company.name
"items[0].name"    // params.items[0].name
```

#### JavaScript Expressions
```javascript
// Use js: prefix for expressions
"js:params.value * 2"                    // Mathematical operations
"js:params.status === 'active'"          // Boolean expressions
"js:new Date(params.createdAt)"          // Date operations
"js:params.tags.join(', ')"              // Array operations
```

## 🚀 Advanced Usage

### Conditional Mapping

```json
{
  "fieldMap": {
    "id": "id",
    "name": "name",
    "status": "status",
    "metadata": "js:params.status === 'active' ? params.metadata : null",
    "lastActive": "js:params.status === 'active' ? params.lastLogin : null"
  }
}
```

### Array Transformations

```json
{
  "fieldMap": {
    "userIds": "js:params.users.map(u => u.id)",
    "activeUsers": "js:params.users.filter(u => u.status === 'active')",
    "userSummary": "js:params.users.map(u => ({ id: u.id, name: u.name }))",
    "totalActive": "js:params.users.filter(u => u.status === 'active').length"
  }
}
```

### Type Conversion

```json
{
  "fieldMap": {
    "id": "js:parseInt(params.id)",
    "price": "js:parseFloat(params.price)",
    "isActive": "js:Boolean(params.isActive)",
    "tags": "js:Array.isArray(params.tags) ? params.tags : [params.tags]",
    "createdAt": "js:new Date(params.createdAt)"
  }
}
```

### Template Processing

```json
{
  "fieldMap": {
    "welcomeMessage": "js:`Welcome ${params.user.name}!`",
    "profileUrl": "js:`/users/${params.user.id}/profile`",
    "apiEndpoint": "js:`${params.baseUrl}/api/v1/users/${params.user.id}`",
    "formattedDate": "js:new Date(params.createdAt).toLocaleDateString()"
  }
}
```

## ⚠️ Error Handling

### Common Issues

**Missing Input Fields**
```json
// Problematic: field doesn't exist
{
  "fieldMap": {
    "name": "user.name"  // Error if params.user is undefined
  }
}

// Fixed: add null checking
{
  "fieldMap": {
    "name": "js:params.user?.name || 'Unknown'"
  }
}
```

**Invalid JavaScript Expressions**
```json
// Problematic: syntax error
{
  "fieldMap": {
    "result": "js:params.value +"  // Incomplete expression
  }
}

// Fixed: complete expression
{
  "fieldMap": {
    "result": "js:params.value + 10"
  }
}
```

**Type Mismatches**
```json
// Problematic: wrong data type
{
  "fieldMap": {
    "count": "js:params.items.length"  // Error if params.items is not array
  }
}

// Fixed: type checking
{
  "fieldMap": {
    "count": "js:Array.isArray(params.items) ? params.items.length : 0"
  }
}
```

### Error Recovery

```json
// Implement safe transformations
{
  "fieldMap": {
    "id": "js:params.id || 'unknown'",
    "name": "js:params.name || 'Unnamed'",
    "email": "js:params.contact?.email || params.email || 'no-email@example.com'",
    "status": "js:params.status || 'inactive'",
    "score": "js:typeof params.score === 'number' ? params.score : 0"
  }
}
```

## 🔍 Debugging

### Testing Transformations

```json
// Test with sample data
const sampleInput = {
  user: {
    id: 123,
    name: "John Doe",
    email: "john@example.com"
  },
  status: "active",
  score: 85
};

// Test field mappings
const testMappings = {
  "userId": "user.id",
  "userName": "user.name",
  "isActive": "js:params.status === 'active'",
  "grade": "js:params.score >= 90 ? 'A' : params.score >= 80 ? 'B' : 'C'"
};
```

### Logging Transformations

```json
// Add logging to transformations
{
  "fieldMap": {
    "id": "id",
    "name": "name",
    "processedName": "js:console.log('Processing:', params.name) || params.name.toUpperCase()",
    "timestamp": "js:new Date().toISOString()"
  }
}
```

### Validation Checks

```json
// Validate transformation results
{
  "fieldMap": {
    "id": "js:validateId(params.id)",
    "email": "js:validateEmail(params.email)",
    "age": "js:validateAge(params.age)",
    "isValid": "js:validateId(params.id) && validateEmail(params.email) && validateAge(params.age)"
  }
}
```

The Transformer block provides flexible and powerful data transformation capabilities, making it easy to restructure data to match your API requirements and prepare information for downstream processing.
