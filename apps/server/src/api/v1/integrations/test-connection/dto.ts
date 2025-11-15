import { z } from "zod";
import { integrationsGroupSchema } from "../schemas";

export const requestBodySchema = z.object({
  group: integrationsGroupSchema,
  variant: z.string(),
  config: z.any(),
});

export const responseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});
