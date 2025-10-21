import { z } from "zod";
import { HttpMethod } from "../../../../db/schema";

export const requestBodySchema = z.object({
  name: z.string().min(2).max(255),
  path: z
    .string()
    .min(1)
    .regex(/^\/(?!.*\/\/)[a-zA-Z0-9-\/]*$/),
  method: z.enum(HttpMethod),
  active: z.boolean(),
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
