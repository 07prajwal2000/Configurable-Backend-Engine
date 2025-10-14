import z from "zod";
import { requestBodySchema, responseSchema } from "./dto";
import { createDependency, createRoute, checkRouteExist } from "./repository";
import { ConflictError } from "../../../../errors/conflictError";
import { db } from "../../../../db";
import { CHAN_ON_ROUTE_CHANGE, publishMessage } from "../../../../db/redis";
import { generateID } from "@cbe/lib";

export default async function handleRequest(
  data: z.infer<typeof requestBodySchema>
): Promise<z.infer<typeof responseSchema>> {
  const result = await db.transaction(async (tx) => {
    const existingRoute = await checkRouteExist(data.name, data.path, tx);
    if (existingRoute) {
      throw new ConflictError(`route with name or path already exist`);
    }
    const id = generateID();
    const newRouteId = await createRoute({ ...data, id }, tx);
    await createDependency(newRouteId, tx);
    return {
      id: newRouteId,
    };
  });
  await publishMessage(CHAN_ON_ROUTE_CHANGE, "");
  return result;
}
