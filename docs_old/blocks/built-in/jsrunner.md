---
title: JavaScript Runner Block
---

# JavaScript Runner Block

The JavaScript Runner block provides a powerful way to execute custom JavaScript code within your API workflows. It runs code in an isolated sandbox environment with access to the request context, enabling complex logic, data transformations, and integrations.

## 🎯 Purpose

This block allows you to write and execute custom JavaScript code to handle complex processing requirements that cannot be achieved with standard blocks. It's particularly useful for:

- Complex data transformations
- Custom business logic implementation
- External API integrations
- Advanced calculations and algorithms
- Dynamic content generation

## ⚙️ Configuration

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| *(JavaScript code)* | `string` | ✅ | JavaScript code to execute |

### Code Input
The block accepts any valid JavaScript code as a string. The code has access to:

- **Context Variables**: `context.vars`
- **HTTP Data**: Request parameters, headers, body
- **Input Parameters**: Data from previous blocks
- **JavaScript APIs**: Standard JavaScript functionality

## 🔄 Execution Flow

1. **Code Validation**: Basic syntax validation
2. **VM Execution**: Code runs in isolated JavaScript VM
3. **Context Access**: Full access to request context
4. **Result Processing**: Captures return value or last expression
5. **Error Handling**: Catches and reports execution errors

## 📝 Example Usage

### Simple Data Transformation

```javascript
// Transform user data
const user = context.vars.user;
return {
  fullName: `${user.firstName} ${user.lastName}`,
  email: user.email.toLowerCase(),
  isActive: user.status === 'active'
};
```

### API Integration

```javascript
// Call external API
const response = await fetch('https://api.example.com/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${context.vars.apiKey}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
return data.users;
```

### Complex Calculations

```javascript
// Calculate business metrics
const orders = context.vars.orders;
const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
const averageOrder = totalRevenue / orders.length;
const topProducts = orders
  .flatMap(order => order.items)
  .reduce((acc, item) => {
    acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
    return acc;
  }, {});

return {
  totalRevenue,
  averageOrder,
  topProducts
};
```

### Dynamic Content Generation

```javascript
// Generate personalized response
const user = context.vars.user;
const preferences = context.vars.preferences;

const greeting = preferences.language === 'es'
  ? `¡Hola ${user.name}!`
  : `Hello ${user.name}!`;

const recommendations = context.vars.products
  .filter(product => product.category === preferences.favoriteCategory)
  .slice(0, 5);

return {
  greeting,
  recommendations,
  timestamp: new Date().toISOString()
};
```

## 🔗 Connections

### Input
- **Target**: Receives input data as `params` variable

### Output
- **Source**: Sends execution result to next block
- **Success**: Executes when code runs successfully
- **Error**: Executes when code throws an error or fails

## 🔧 JavaScript Environment

### Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `context` | Full request context | `context.vars.user` |
| `params` | Input from previous block | `params.data` |
| `console` | Logging functionality | `console.log('Debug')` |

### Context Access

```javascript
// HTTP Data
const userId = context.vars.getRouteParam('userId');
const authToken = context.vars.getHeader('Authorization');
const requestBody = context.vars.getRequestBody();

// Context Variables
const user = context.vars.user;
const config = context.vars.appConfig;

// Request Info
const method = context.httpRequestMethod;
const route = context.httpRequestRoute;
```

### Utility Functions

```javascript
// HTTP Operations
context.vars.setHeader('Content-Type', 'application/json');
context.vars.setCookie('session', 'abc123');

// Variable Management
context.vars.userProfile = { name: 'John', role: 'admin' };
context.vars.processedData = transformData(params);
```

## 🎨 Use Cases

### Data Validation and Sanitization

```javascript
// Validate and sanitize user input
const input = params;

if (!input.email || !input.email.includes('@')) {
  throw new Error('Invalid email address');
}

return {
  email: input.email.toLowerCase().trim(),
  name: input.name.trim(),
  age: parseInt(input.age) || 0,
  isValid: true
};
```

### Database Operations

```javascript
// Simulate database operations
const userId = context.vars.getRouteParam('userId');
const userData = params;

// In a real scenario, this would connect to a database
const updatedUser = {
  ...userData,
  id: userId,
  updatedAt: new Date().toISOString(),
  version: (userData.version || 0) + 1
};

// Store in context for next blocks
context.vars.updatedUser = updatedUser;

return updatedUser;
```

### External Service Integration

```javascript
// Integrate with payment service
const paymentData = params;

try {
  const paymentResponse = await fetch('https://api.payment.com/charge', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${context.vars.paymentApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: paymentData.amount,
      currency: paymentData.currency,
      source: paymentData.token
    })
  });

  const result = await paymentResponse.json();

  if (!paymentResponse.ok) {
    throw new Error(`Payment failed: ${result.message}`);
  }

  return {
    success: true,
    transactionId: result.id,
    amount: result.amount,
    status: result.status
  };

} catch (error) {
  return {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

### Complex Business Logic

```javascript
// Implement business rules
const order = params;
const user = context.vars.user;

let discount = 0;

// Apply business rules
if (user.membership === 'premium') {
  discount = 0.1; // 10% discount
} else if (order.total > 100) {
  discount = 0.05; // 5% discount for large orders
}

if (user.loyaltyPoints > 1000) {
  discount += 0.05; // Additional 5% for loyal customers
}

// Calculate final amount
const discountAmount = order.total * discount;
const finalAmount = order.total - discountAmount;

// Apply tax
const taxRate = context.vars.taxRate || 0.08;
const taxAmount = finalAmount * taxRate;
const totalWithTax = finalAmount + taxAmount;

return {
  originalAmount: order.total,
  discountAmount,
  discountPercentage: discount * 100,
  amountAfterDiscount: finalAmount,
  taxAmount,
  taxRate: taxRate * 100,
  totalAmount: totalWithTax,
  appliedRules: {
    premiumMember: user.membership === 'premium',
    largeOrder: order.total > 100,
    loyalCustomer: user.loyaltyPoints > 1000
  }
};
```

## 🔧 Best Practices

### Code Organization
- Keep functions focused and single-purpose
- Use meaningful variable names
- Add comments for complex logic
- Break large code blocks into smaller functions

### Error Handling
- Always wrap external API calls in try-catch
- Provide meaningful error messages
- Handle different error scenarios appropriately
- Use custom error types for better error handling

### Performance Considerations
- Avoid blocking operations in hot paths
- Cache expensive computations when possible
- Use efficient algorithms and data structures
- Minimize external API calls

### Security Guidelines
- Validate all inputs before processing
- Sanitize data to prevent injection attacks
- Use HTTPS for external API calls
- Don't log sensitive information

## 🔗 Related Blocks

- **[Set Variable](./setvar.md)**: Store results from JavaScript execution
- **[Get Variable](./getvar.md)**: Access stored data in JavaScript
- **[If](./if.md)**: Make decisions based on JavaScript results
- **[Transformer](./transformer.md)**: Alternative for data transformations
- **[Console Log](./console.md)**: Debug JavaScript execution

## 📚 API Reference

### Input Schema
```typescript
string // JavaScript code as string
```

### Output Schema
```typescript
{
  successful: boolean,
  output: any,           // Return value of JavaScript code
  next?: string,
  error?: string,        // Error message if execution fails
  continueIfFail: boolean
}
```

### Context Interface
```typescript
interface Context {
  vm: JsVM;                              // JavaScript VM instance
  route: string;                         // Current route path
  apiId: string;                         // API identifier
  vars: ContextVarsType & Record<string, any>; // Context variables
  requestBody?: any;                     // Parsed request body
}
```

### Available Methods
```typescript
// HTTP Data Access
context.vars.getQueryParam(key: string): string
context.vars.getRouteParam(key: string): string
context.vars.getHeader(key: string): string
context.vars.getCookie(key: string): string
context.vars.getRequestBody(): any

// HTTP Response
context.vars.setHeader(key: string, value: string): void
context.vars.setCookie(name: string, value: any): void
```

## 🚀 Advanced Usage

### Async Operations

```javascript
// Handle asynchronous operations
async function processData(data) {
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 100));

  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}

const result = await processData(params);
return result;
```

### Complex Data Structures

```javascript
// Work with complex nested data
function flattenUserData(user) {
  return {
    id: user.id,
    name: user.profile.name,
    email: user.contact.email,
    address: {
      street: user.profile.address.street,
      city: user.profile.address.city,
      country: user.profile.address.country
    },
    preferences: user.settings.preferences,
    lastLogin: user.activity.lastLogin,
    isActive: user.status === 'active'
  };
}

const flattenedUsers = params.users.map(flattenUserData);
return flattenedUsers;
```

### State Management

```javascript
// Manage complex state across executions
if (!context.vars.sessionData) {
  context.vars.sessionData = {
    startTime: new Date(),
    operations: [],
    counters: {}
  };
}

context.vars.sessionData.operations.push({
  type: 'javascript_execution',
  timestamp: new Date(),
  input: params
});

context.vars.sessionData.counters.javascriptRuns =
  (context.vars.sessionData.counters.javascriptRuns || 0) + 1;

return {
  sessionDuration: Date.now() - context.vars.sessionData.startTime,
  totalOperations: context.vars.sessionData.operations.length,
  javascriptRuns: context.vars.sessionData.counters.javascriptRuns
};
```

## ⚠️ Error Handling

### Common Issues

**Syntax Errors**
```javascript
// Problematic: syntax error
const result = params.data.map(item => {
  return item.value * 2; // Missing closing brace
});

// Fixed
const result = params.data.map(item => {
  return item.value * 2;
});
```

**Undefined Variables**
```javascript
// Problematic: undefined context variable
const user = context.vars.nonExistentUser; // Will be undefined
return user.name; // Error: Cannot read property 'name'

// Fixed
const user = context.vars.user || { name: 'Unknown' };
return user.name;
```

**Async/Await Issues**
```javascript
// Problematic: missing await
const result = fetch('https://api.example.com/data');
return result; // Returns Promise, not data

// Fixed
const response = await fetch('https://api.example.com/data');
const result = await response.json();
return result;
```

### Error Recovery

```javascript
// Implement error boundaries
try {
  const data = params.requiredData;
  if (!data) {
    throw new Error('Required data is missing');
  }

  const result = processData(data);
  return result;

} catch (error) {
  // Log error for debugging
  console.error('JavaScript execution error:', error);

  // Return safe fallback
  return {
    success: false,
    error: error.message,
    fallbackData: {}
  };
}
```

## 🔍 Debugging

### Logging and Debugging

```javascript
// Debug JavaScript execution
console.log('Input params:', params);
console.log('Context variables:', Object.keys(context.vars));
console.log('Current route:', context.route);

// Step-by-step debugging
function debugStep(step, data) {
  console.log(`Step ${step}:`, data);
  return data;
}

const result = debugStep(1, params)
  .map(item => debugStep(2, item))
  .filter(item => debugStep(3, item.active))
  .reduce((acc, item) => debugStep(4, acc + item.value), 0);

return result;
```

### Performance Monitoring

```javascript
// Monitor execution time
const startTime = Date.now();

try {
  // Your complex logic here
  const result = await complexOperation(params);

  const executionTime = Date.now() - startTime;
  console.log(`Execution time: ${executionTime}ms`);

  return result;

} catch (error) {
  const executionTime = Date.now() - startTime;
  console.error(`Execution failed after ${executionTime}ms:`, error);
  throw error;
}
```

The JavaScript Runner block provides unparalleled flexibility for implementing custom logic in your API workflows, making it possible to handle virtually any requirement that standard blocks cannot address.
