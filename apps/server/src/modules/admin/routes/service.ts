import {
  createRoute,
  getRouteById,
  getAllRoutes,
  updateRoute,
  deleteRoute,
} from "./repository";
import { RouteType } from "./dto";
import { generateID } from "@cbe/lib";
import { createBlockService } from "../blocks/service";

export async function createRouteService(data: RouteType) {
  // Generate ID if not provided
  const routeData = {
    ...data,
    id: generateID(),
  };

  const result = await createRoute(routeData);
  await createBlockService({
    routeId: result.id,
    type: "entrypoint",
    position: {
      x: 0,
      y: 0,
    },
  });
  await createBlockService({
    routeId: result.id,
    type: "response",
    position: {
      x: 0,
      y: 100,
    },
    data: {
      httpCode: "200",
    },
  });
  return result;
}

export async function getRouteByIdService(id: string) {
  return await getRouteById(id);
}

export async function getAllRoutesService() {
  return await getAllRoutes();
}

export async function updateRouteService(id: string, data: RouteType) {
  return await updateRoute(id, data);
}

export async function deleteRouteService(id: string) {
  return await deleteRoute(id);
}
