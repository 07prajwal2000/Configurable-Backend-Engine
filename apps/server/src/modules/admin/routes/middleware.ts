import { Context, Next } from "hono";

// Middleware to validate route data
export async function validateRouteData(c: Context, next: Next) {
  // Add any route-specific middleware logic here
  // For now, we'll just pass through to the next handler
  await next();
}
