import z from "zod";
import { requestQuerySchema, responseSchema } from "./dto";
import { getRoutesList } from "./repository";

export default async function handleRequest(
  query: z.infer<typeof requestQuerySchema>
): Promise<z.infer<typeof responseSchema>> {
  const offset = query.perPage * (query.page - 1);
  const { result, totalCount } = await getRoutesList(offset, query.perPage);
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
    })),
  };
}
