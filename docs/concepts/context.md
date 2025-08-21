---
title: The Context
---

# The Request Context
The request context has access to the following:

- Query Parameters: HTTP Query parameters such as `/api/fruits?search=apple&color=green`
- Route Parameters: HTTP Route parameters such as `/api/fruits/{fruitID}`
- Headers: HTTP Headers such as `Authorization: Bearer <token>`
- Cookies: HTTP Cookies such as `sessionID=123456`
- HTTP Method: HTTP Method such as `GET`, `POST`, `PUT`, `DELETE`
- and more...

## Accessing the Context
- Accessing the query parameter in Js Runner Block
```javascript
  const { search, color } = vars.httpRequestQuery;
```
- Accessing the route parameter in Js Runner Block
```javascript
  const { fruitID } = vars.httpRequestRoute;
```
- Accessing the header parameter in Js Runner Block
```javascript
  const { authorization } = vars.httpRequestHeaders;
```
- Accessing the cookie parameter in Js Runner Block
```javascript
  const { sessionID } = vars.httpRequestCookies;
```
- Accessing the http method parameter in Js Runner Block
```javascript
  const httpMethod = vars.httpRequestMethod;
```