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

// Bulk operation schemas
export const bulkBlockOperationSchema = z.object({
  action: z.enum(["create", "update", "delete"]),
  content: z.any(), // Block data
});

export const bulkEdgeOperationSchema = z.object({
  action: z.enum(["create", "update", "delete"]),
  content: z.any(), // Edge data
});

export const bulkOperationSchema = z.object({
  blocks: z.array(bulkBlockOperationSchema),
  edges: z.array(bulkEdgeOperationSchema),
});

export type BulkBlockOperation = z.infer<typeof bulkBlockOperationSchema>;
export type BulkEdgeOperation = z.infer<typeof bulkEdgeOperationSchema>;
export type BulkOperation = z.infer<typeof bulkOperationSchema>;
