import { z } from "zod";

export const requestQuerySchema = z.object({
  search: z.string().min(1).max(25).optional(),
});

export const responseSchema = z.array(z.string());
