import { z } from "zod";
import { requestBodySchema, responseSchema } from "./dto";
import { getRouteById } from "../get-by-id/repository";
import { db } from "../../../../db";
import { NotFoundError } from "../../../../errors/notFoundError";
import { ConflictError } from "../../../../errors/conflictError";
import { getRouteByNameOrPath, updateRoute } from "../update/repository";
import { publishMessage, CHAN_ON_ROUTE_CHANGE } from "../../../../db/redis";
import { ServerError } from "../../../../errors/serverError";

export default async function handleRequest(
  id: string,
  data: z.infer<typeof requestBodySchema>
): Promise<z.infer<typeof responseSchema>> {
  const result = await db.transaction(async (tx) => {
    const existingRoute = await getRouteByNameOrPath(
      id,
      data.name ?? "",
      data.path ?? "",
      data.method ?? ("NONE" as any),
      tx
    );
    if (!existingRoute) {
      throw new NotFoundError("Route not found");
    }
    if (existingRoute.id !== id) {
      throw new ConflictError("Route already exists");
    }
    const patchedRoute = existingRoute;
    if (data.name) patchedRoute.name = data.name;
    if (data.path) patchedRoute.path = data.path;
    if (data.method) patchedRoute.method = data.method;
    if (data.active !== undefined) patchedRoute.active = data.active;
    return await updateRoute(
      {
        ...patchedRoute,
        id,
      },
      tx
    );
  });
  if (!result) {
    throw new ServerError("Something went wrong while updating the route");
  }
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return {
    id: result.id,
    name: result.name!,
    path: result.path!,
    method: result.method!,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
}
