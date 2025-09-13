import { z } from "zod";

// Define the Zod schema for blocksEntity
export const blockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }), // JSON field
  data: z.any().optional(), // JSON field
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  routeId: z.string(),
});

// Define the type for blocksEntity
export type BlockType = z.infer<typeof blockSchema>;

// Define specific schemas for each operation
export const createBlockSchema = blockSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateBlockSchema = blockSchema
  .omit({
    routeId: true,
    id: true,
    createdAt: true,
  })
  .partial();

export const getBlockByIdSchema = z.object({
  id: z.string(),
});

export const getBlockByPathSchema = z.object({
  path: z.string(),
});
