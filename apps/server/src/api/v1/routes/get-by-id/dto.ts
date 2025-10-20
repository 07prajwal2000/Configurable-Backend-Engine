import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { routesEntity } from "../../../../db/schema";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const responseSchema = createSelectSchema(routesEntity).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});
