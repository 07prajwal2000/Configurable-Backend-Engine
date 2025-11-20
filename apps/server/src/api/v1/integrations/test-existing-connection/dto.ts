import { z } from "zod";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const responseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
