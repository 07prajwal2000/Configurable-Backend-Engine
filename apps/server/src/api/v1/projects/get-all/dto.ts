import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { projectsEntity } from "../../../../db/schema";
import {
  paginationRequestQuerySchema,
  paginationResponseSchema,
} from "../../../../lib/pagination";

export const requestQuerySchema = z.clone(paginationRequestQuerySchema);

export const responseSchema = z.object({
  data: z.array(
    createSelectSchema(projectsEntity).extend({
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  pagination: paginationResponseSchema,
});
