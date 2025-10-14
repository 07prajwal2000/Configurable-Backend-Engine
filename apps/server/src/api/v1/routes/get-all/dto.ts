import z from "zod";
import {
  paginationRequestQuerySchema,
  paginationResponseSchema,
} from "../../../../lib/pagination";
import { createSelectSchema } from "drizzle-zod";
import { routesEntity } from "../../../../db/schema";

export const requestQuerySchema = z.clone(paginationRequestQuerySchema);

export const responseSchema = z.object({
  data: z.array(
    createSelectSchema(routesEntity).extend({ createdAt: z.string() })
  ),
  pagination: paginationResponseSchema,
});
