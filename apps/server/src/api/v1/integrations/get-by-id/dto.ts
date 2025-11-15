import { z } from "zod";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  variant: z.string(),
  config: z.object(),
});
