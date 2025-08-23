---
title: The Context
---

# The Request Context
The request context has access to the following:

- Query Parameters: HTTP Query parameters such as `/api/fruits?search=apple&color=green`
- Route Parameters: HTTP Route parameters such as `/api/fruits/{fruitID}`
- Request Headers: HTTP Headers such as `Authorization: Bearer <token>`
- Cookies: HTTP Cookies such as `sessionID=123456`
- HTTP Method: HTTP Method such as `GET`, `POST`, `PUT`, `DELETE`
- and more...

## Accessing the Context
All variables in the example such as `httpRequestQuery` is a global variable and can be accessed from [Js Runner](../blocks/built-in/jsrunner.md) block.

- Accessing the query parameter in Js Runner Block
```javascript
  const search = getQueryParam('search');
  const fruitId = getRouteParam('fruitID');
  const authToken = getHeader('Authorization')
  const sessionId = getCookie('sessionID');
  setCookie('sessionID', {
    value: '123456',
  });
  setHeader('Content-Type', 'application/json');
  const requestBody = getRequestBody(); // { "name": "Apple", "color": "Green" }
  const method = httpRequestMethod; // GET, POST, PUT, DELETE
  const route = httpRequestRoute; // /api/fruits/{fruitID}
```
