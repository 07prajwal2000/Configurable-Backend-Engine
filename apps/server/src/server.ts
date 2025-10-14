import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { mapRouter } from "./modules/requestRouter/router";
import { loadRoutes } from "./loaders/routesLoader";
import { drizzleInit } from "./db";
import { mapAdminRouter } from "./modules/admin/router";
import { initializeRedis } from "./db/redis";
import { loadAppConfig } from "./loaders/appconfigLoader";
import { loadIntegrations } from "./loaders/integrationsLoader";
import { mapVersionedAdminRoutes } from "./api/register";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Hono();

// Global CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow requests from localhost on common development ports
      if (!origin) return null; // Allow requests without origin (like mobile apps)
      if (origin.startsWith("http://localhost:")) {
        return origin;
      }
      return null; // Reject other origins
    },
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

async function main() {
  const adminRoutesEnabled = Boolean(process.env.ENABLE_ADMIN);
  app.onError(errorHandler);
  await drizzleInit();
  await initializeRedis();
  await loadAppConfig();
  await loadIntegrations();
  const parser = await loadRoutes();
  await mapRouter(app, parser);
  if (adminRoutesEnabled) {
    mapAdminRouter(app);
    mapVersionedAdminRoutes(app);
  }
}
main();

export { app };
