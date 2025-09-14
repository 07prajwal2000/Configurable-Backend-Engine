import { Hono } from "hono";
import { mapRouteEndpoints } from "./routes/router";
import { mapBlockEndpoints } from "./blocks/router";
import { mapEdgeEndpoints } from "./edges/router";

export function mapAdminRouter(app: Hono) {
  const router = app.basePath("/_/admin");
  mapRouteEndpoints(router.basePath("/"));
  mapBlockEndpoints(router.basePath("/"));
  mapEdgeEndpoints(router.basePath("/"));
}
