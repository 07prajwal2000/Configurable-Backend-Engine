import { HttpRoute, HttpRouteParser } from "@cbe/lib";
import { db } from "../db";
import { routesEntity } from "../db/schema";

const dummyRoutes: HttpRoute[] = [
  {
    method: "GET",
    path: "/api/users",
    routeId: "1",
  },
  {
    method: "GET",
    path: "/api/users/:id",
    routeId: "2",
  },
];

export async function loadRoutes() {
  const parser = new HttpRouteParser();
  const routes = await db
    .select({
      method: routesEntity.method,
      path: routesEntity.path,
      routeId: routesEntity.id,
    })
    .from(routesEntity);

  // @ts-ignore
  parser.buildRoutes(routes);
  return parser;
}
