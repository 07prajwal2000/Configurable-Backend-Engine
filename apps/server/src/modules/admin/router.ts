import { Hono } from "hono";
import { mapRouteEndpoints } from "./routes/router";
import { mapBlockEndpoints } from "./blocks/router";
import { mapEdgeEndpoints } from "./edges/router";
import { mapAppConfigEndpoints } from "./appconfig/router";
import { errorHandler } from "../../middlewares/errorHandler";
import { openAPIRouteHandler } from "hono-openapi";
import { readFileSync } from "fs";
import { join } from "path";

export function mapAdminRouter(app: Hono) {
  const router = app.basePath("/_/admin");

  // Apply global error handler middleware
  app.onError(errorHandler);

  // OpenAPI endpoint
  router.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "Configurable Backend Engine Admin API",
          version: "1.0.0",
          description:
            "Admin API for managing routes, blocks, and configurations",
        },
        servers: [{ url: "/_/admin", description: "Admin API server" }],
      },
    })
  );
  router.get("/openapi/ui", (c) => {
    try {
      const htmlContent = loadHtmlContent();
      return c.html(htmlContent);
    } catch (error) {
      return c.text("OpenAPI UI file not found", 404);
    }
  });

  mapRouteEndpoints(router.basePath("/"));
  mapBlockEndpoints(router.basePath("/"));
  mapEdgeEndpoints(router.basePath("/"));
  mapAppConfigEndpoints(router.basePath("/"));
}

let cachedHtmlContent: string | null = null;

// Function to load and cache HTML content
function loadHtmlContent(): string {
  if (cachedHtmlContent) {
    return cachedHtmlContent;
  }

  try {
    const htmlPath = join(process.cwd(), "src/public/openapi.html");
    cachedHtmlContent = readFileSync(htmlPath, "utf-8");
    return cachedHtmlContent;
  } catch (error) {
    throw new Error("OpenAPI UI file not found");
  }
}
