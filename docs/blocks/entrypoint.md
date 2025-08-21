---
title: Entrypoint Block
---

# Entrypoint Block
This is the default and exists only one in any request. It is the starting point of the request, which takes care of parsing request body, query/route params, and headers. 

![Entry point](/assets/blocks/entrypoint.png)

### Connections
| Type | Purpose |
|------|-------|
| Source | The body of the request will be passed to the next block |

