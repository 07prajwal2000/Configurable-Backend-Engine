import z from "zod";
import {
  paginationRequestQuerySchema,
  paginationResponseSchema,
} from "../../../../lib/pagination";
import { createSelectSchema } from "drizzle-zod";
import { routesEntity } from "../../../../db/schema";

export const fieldEnumSchema = z.enum([
  "id",
  "name",
  "path",
  "active",
  "projectId",
  "method",
]);

// ?filter.field=FIELD&filter.value=something&filter.operator=eq
export const requestQuerySchema = z
  .clone(paginationRequestQuerySchema)
  .extend({
    "filter.field": fieldEnumSchema,
    "filter.operator": z
      .enum(["eq", "neq", "gt", "gte", "lt", "lte", "like"])
      .optional(),
    "filter.value": z.string().optional(),
  })
  .transform((q) => ({
    page: q.page,
    perPage: q.perPage,
    filter: {
      field: q["filter.field"],
      operator: q["filter.operator"],
      value: q["filter.value"],
    },
  }));

export const responseSchema = z.object({
  data: z.array(
    createSelectSchema(routesEntity).extend({
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  pagination: paginationResponseSchema,
});
