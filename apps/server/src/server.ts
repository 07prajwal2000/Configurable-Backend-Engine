import "dotenv/config";
import { Hono } from "hono";
import { mapRouter } from "./modules/requestRouter/router";
import { loadRoutes } from "./loaders/routesLoader";
import { drizzleInit } from "./db";
import { mapAdminRouter } from "./modules/admin/router";
import { setupOpenAPI } from "./modules/admin/openapi";

const app = new Hono();

async function main() {
  const adminRoutesEnabled = Boolean(process.env.ENABLE_ADMIN);
  await drizzleInit();
  const parser = await loadRoutes();
  await mapRouter(app, parser);
  if (adminRoutesEnabled) {
    mapAdminRouter(app);
    setupOpenAPI(app);
  }
}
main();

export { app };
