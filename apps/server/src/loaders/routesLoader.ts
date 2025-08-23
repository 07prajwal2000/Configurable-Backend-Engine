import { HttpRoute, HttpRouteParser } from "@cbe/lib";

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
  parser.buildRoutes(dummyRoutes);
  // TODO: load from Db and cache it in redis, and refresh it when Db is updated (use redis pub/sub for notifications)
  return parser;
}
