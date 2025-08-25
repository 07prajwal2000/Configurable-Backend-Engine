import "dotenv/config";
import { Hono } from "hono";
import { mapRouter } from "./router";
import { loadRoutes } from "./loaders/routesLoader";
import { drizzleInit } from "./db";

const app = new Hono();

async function main() {
  const parser = await loadRoutes();
  await drizzleInit();
  await mapRouter(app, parser);
}
main();

export { app };
