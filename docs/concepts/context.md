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
  const { search, color } = httpRequestQuery;
```
- Accessing the route parameter in Js Runner Block
```javascript
  const { fruitID } = httpRequestRoute;
```
- Accessing the request header parameter in Js Runner Block
```javascript
  const { authorization } = httpRequestHeaders;
```
- Accessing the cookie parameter in Js Runner Block
```javascript
  const { sessionID } = httpRequestCookies;
```
- Accessing the http method parameter in Js Runner Block
```javascript
  const httpMethod = httpRequestMethod;
```
- Setting the http response header parameter in Js Runner Block
```javascript
  responseHttpHeaders['Content-Type'] = 'application/json';
```
