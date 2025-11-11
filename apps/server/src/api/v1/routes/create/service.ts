import z from "zod";
import { requestBodySchema, responseSchema } from "./dto";
import {
  createDependency,
  createRoute,
  checkRouteExist,
  checkProjectExist,
  getPersonalProjectId,
} from "./repository";
import { ConflictError } from "../../../../errors/conflictError";
import { db } from "../../../../db";
import { CHAN_ON_ROUTE_CHANGE, publishMessage } from "../../../../db/redis";
import { generateID } from "@cbe/lib";
import { NotFoundError } from "../../../../errors/notFoundError";

export default async function handleRequest(
  userId: string,
  data: z.infer<typeof requestBodySchema>
): Promise<z.infer<typeof responseSchema>> {
  const result = await db.transaction(async (tx) => {
    if (data.projectId !== "personal") {
      const projectExist = await checkProjectExist(data.projectId, tx);
      if (!projectExist) {
        throw new NotFoundError(
          `project with id ${data.projectId} does not exist`
        );
      }
    } else {
      data.projectId = await getPersonalProjectId(tx);
    }
    const existingRoute = await checkRouteExist(
      data.name,
      data.path,
      data.method,
      tx
    );
    if (existingRoute) {
      throw new ConflictError(`route with name or path already exist`);
    }
    const id = generateID();
    const newRouteId = await createRoute(
      { ...data, id, createdBy: userId },
      tx
    );
    await createDependency(newRouteId, tx);
    return {
      id: newRouteId,
    };
  });
  await publishMessage(CHAN_ON_ROUTE_CHANGE, result.id);
  return result;
}
