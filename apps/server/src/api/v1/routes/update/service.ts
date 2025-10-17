import { z } from "zod";
import { requestBodySchema, responseSchema } from "./dto";
import { db } from "../../../../db";
import { getRouteByNameOrPath, updateRoute } from "./repository";
import { NotFoundError } from "../../../../errors/notFoundError";
import { ConflictError } from "../../../../errors/conflictError";
import { ServerError } from "../../../../errors/serverError";
import { publishMessage, CHAN_ON_ROUTE_CHANGE } from "../../../../db/redis";

export default async function handleRequest(
  id: string,
  data: z.infer<typeof requestBodySchema>
): Promise<z.infer<typeof responseSchema>> {
  const result = await db.transaction(async (tx) => {
    const existingRoute = await getRouteByNameOrPath(
      id,
      data.name,
      data.path,
      data.method,
      tx
    );
    if (!existingRoute) {
      throw new NotFoundError("Route not found");
    }
    if (existingRoute.id !== id) {
      throw new ConflictError("Route already exists");
    }
    return await updateRoute({
      id,
      ...data,
    });
  });
  if (!result) {
    throw new ServerError("Something went wrong while updating the route");
  }
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return {
    ...result,
    createdAt: result.createdAt.toISOString(),
  };
}
