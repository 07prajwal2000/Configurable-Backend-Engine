import { Hono } from "hono";
import { mapRouter } from "./router";
import { loadRoutes } from "./loaders/routesLoader";

const app = new Hono();

async function main() {
  const parser = await loadRoutes();
  await mapRouter(app, parser);
}
main();

export { app };
