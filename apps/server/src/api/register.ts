import { Hono } from "hono";
import v1Register from "./v1/register";

export function mapVersionedAdminRoutes(app: Hono) {
  const router = app.basePath("/_/admin");
  v1Register.registerHandler(router);
}
