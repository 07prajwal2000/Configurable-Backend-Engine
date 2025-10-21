import { z } from "zod";

export const requestBodySchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .refine(
      (v) => v !== "__personal",
      "__personal is a special name and cannot be used as a project name"
    ),
});

export const responseSchema = z.object({ id: z.string() });
