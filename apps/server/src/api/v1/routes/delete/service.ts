import { z } from "zod";
import { responseSchema } from "./dto";
import { deleteRoute, findRouteById } from "./repository";
import { NotFoundError } from "../../../../errors/notFoundError";
import { db } from "../../../../db";
import { publishMessage, CHAN_ON_ROUTE_CHANGE } from "../../../../db/redis";

export default async function handleRequest(
  id: string
): Promise<z.infer<typeof responseSchema>> {
  await db.transaction(async (tx) => {
    const existingRoute = await findRouteById(id, tx);
    if (!existingRoute) {
      throw new NotFoundError("Route not found");
    }
    await deleteRoute(id, tx);
  });
  await publishMessage(CHAN_ON_ROUTE_CHANGE, id);
  return "";
}
