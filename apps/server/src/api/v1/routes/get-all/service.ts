import z from "zod";
import { requestQuerySchema, responseSchema } from "./dto";
import { getRoutesList } from "./repository";
import { eq, gt, gte, ilike, lt, lte, ne, sql } from "drizzle-orm";
import { routesEntity } from "../../../../db/schema";

export default async function handleRequest(
  query: z.infer<typeof requestQuerySchema>
): Promise<z.infer<typeof responseSchema>> {
  const offset = query.perPage * (query.page - 1);
  const filterSQL = generateFilterSQL(query);
  const { result, totalCount } = await getRoutesList(
    offset,
    query.perPage,
    filterSQL
  );
  const hasNext = offset + result.length < totalCount;
  return {
    pagination: {
      hasNext,
      page: query.page,
      totalPages: Math.ceil(totalCount / query.perPage),
    },
    data: result.map((value) => ({
      ...value,
      createdAt: value.createdAt.toISOString(),
      updatedAt: value.updatedAt.toISOString(),
    })),
  };
}

function generateFilterSQL(query?: z.infer<typeof requestQuerySchema>) {
  const filter = query?.filter;

  if (!filter) return sql`1=1`;
  if (!filter.field) return sql`1=1`;
  const field = routesEntity[filter.field];

  if (!filter.operator) return sql`1=1`;
  if (!filter.value) return sql`1=1`;
  if (!field) return sql`1=1`;
  let value: any = filter.value;
  if (value === "true") value = true;
  else if (value === "false") value = false;
  else if (!isNaN(Number(value))) value = Number(value);

  if (filter.operator == "eq" && typeof value === "string")
    return ilike(field, filter.value);
  else if (filter.operator == "eq") return eq(field, value);
  else if (filter.operator == "neq") return ne(field, filter.value);
  else if (filter.operator == "gt") return gt(field, filter.value);
  else if (filter.operator == "gte") return gte(field, filter.value);
  else if (filter.operator == "lt") return lt(field, filter.value);
  else if (filter.operator == "lte") return lte(field, filter.value);
  else if (filter.operator == "like") return ilike(field, `%${filter.value}%`);
}
