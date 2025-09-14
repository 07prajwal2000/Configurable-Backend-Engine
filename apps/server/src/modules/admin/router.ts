import { Hono } from "hono";
import { mapRouteEndpoints } from "./routes/router";
import { mapBlockEndpoints } from "./blocks/router";
import { mapEdgeEndpoints } from "./edges/router";
import { errorHandler } from "../../middlewares/errorHandler";

export function mapAdminRouter(app: Hono) {
  const router = app.basePath("/_/admin");

  // Apply global error handler middleware
  app.onError(errorHandler);

  mapRouteEndpoints(router.basePath("/"));
  mapBlockEndpoints(router.basePath("/"));
  mapEdgeEndpoints(router.basePath("/"));
}
