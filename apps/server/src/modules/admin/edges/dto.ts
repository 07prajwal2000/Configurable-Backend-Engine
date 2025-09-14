import { z } from "zod";

// Define the Zod schema for edgesEntity
export const edgeSchema = z.object({
  id: z.string().optional(),
  from: z.string(),
  to: z.string(),
  fromHandle: z.string().optional(),
  toHandle: z.string().optional(),
});

// Define the type for edgesEntity
export type EdgeType = z.infer<typeof edgeSchema>;

// Define specific schemas for each operation
export const createEdgeSchema = edgeSchema.omit({
  id: true,
});

export const updateEdgeSchema = edgeSchema.partial();

export const getEdgeByIdSchema = z.object({
  id: z.string(),
});

export const getEdgesByRouteIdSchema = z.object({
  routeId: z.string(),
});
