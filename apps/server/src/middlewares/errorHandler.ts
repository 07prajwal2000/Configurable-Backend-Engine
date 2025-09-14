import { Context, Hono } from "hono";
import { HttpError } from "../errors/httpError";
import { ContentfulStatusCode } from "hono/utils/http-status";

export function errorHandler(error: any, c: Context) {
  if (error instanceof HttpError) {
    return c.json({ error: error.message }, error.code as ContentfulStatusCode);
  }

  // Handle other types of errors
  console.error("Unhandled error:", error);
  return c.json({ error: "Internal server error" }, 500);
}

// Helper function to create HttpError instances
export { HttpError };
