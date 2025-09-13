import { z } from "zod";

// Define the Zod schema for routesEntity
export const routeSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  path: z.string(),
  method: z.string(),
  createdAt: z.date().optional(),
});

// Define the type for routesEntity
export type RouteType = z.infer<typeof routeSchema>;

// Define specific schemas for each operation
export const createRouteSchema = routeSchema.omit({
  id: true,
  createdAt: true,
});
export const updateRouteSchema = routeSchema.partial();
export const getRouteByIdSchema = z.object({
  id: z.string(),
});
