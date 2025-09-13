import { Hono } from "hono";
import { mapRouteEndpoints } from "./routes/router";
import { mapBlockEndpoints } from "./blocks/router";

export function mapAdminRouter(app: Hono) {
  const router = app.basePath("/_/admin");
  mapRouteEndpoints(router.basePath("/"));
  mapBlockEndpoints(router.basePath("/"));
}
