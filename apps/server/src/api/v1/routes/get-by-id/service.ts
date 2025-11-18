import z from "zod";
import { NotFoundError } from "../../../../errors/notFoundError";
import { getRouteById } from "./repository";
import { responseSchema } from "./dto";

export default async function handleRequest(
  id: string
): Promise<z.infer<typeof responseSchema>> {
  const route = await getRouteById(id);
  if (!route) {
    throw new NotFoundError("no route found with id: " + id);
  }
  return {
    id: route.id,
    name: route.name!,
    path: route.path!,
    active: route.active!,
    projectId: route.projectId!,
    method: route.method!,
    createdBy: route.createdBy!,
    createdAt: route.createdAt.toISOString(),
    updatedAt: route.updatedAt.toISOString(),
    projectName: route.projectName!,
  };
}
