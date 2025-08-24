import { HttpRouteParser } from "@cbe/lib";
import { Hono } from "hono";
import { handleRequest } from "./service";

export async function mapRouter(app: Hono, parser: HttpRouteParser) {
  app.all("/api/*", async (c) => {
    try {
      const response = await handleRequest(c, parser);
      c.status(response.status);
      return c.json(response.data);
    } catch (error) {
      return c.json(
        { message: error?.toString() || "Internal server error" },
        500
      );
    }
  });
}
