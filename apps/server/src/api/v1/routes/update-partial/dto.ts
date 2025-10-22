import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { routesEntity } from "../../../../db/schema";

export const requestBodySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  path: z
    .string()
    .min(1)
    .regex(/^\/(?!.*\/\/)[a-zA-Z0-9-\/]*$/, "Must be a valid URL path")
    .optional(),
  method: z.string().optional(),
  active: z.boolean().optional(),
});

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  method: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
