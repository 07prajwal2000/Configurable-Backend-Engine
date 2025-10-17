import { z } from "zod";
import { HttpMethod, routesEntity } from "../../../../db/schema";
import { createSelectSchema } from "drizzle-zod";

export const requestBodySchema = z.object({
  name: z.string().min(2).max(255),
  path: z
    .string()
    .min(1)
    .regex(/^\/(?!.*\/\/)[a-zA-Z0-9-\/]*$/),
  method: z.enum(HttpMethod),
});

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const responseSchema = createSelectSchema(routesEntity).extend({
  createdAt: z.string(),
});
