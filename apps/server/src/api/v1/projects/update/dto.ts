import { createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { projectsEntity } from "../../../../db/schema";

export const requestRouteSchema = z.object({
  id: z.uuidv7(),
});

export const requestBodySchema = createUpdateSchema(projectsEntity).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const responseSchema = createSelectSchema(projectsEntity).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});
