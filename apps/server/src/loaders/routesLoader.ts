import { HttpRouteParser } from "@cbe/lib";
import { db } from "../db";
import { routesEntity } from "../db/schema";
import {
  CHAN_ON_ROUTE_CHANGE,
  redisClient,
  subscribeToChannel,
} from "../db/redis";

export async function loadRoutes() {
  const parser = new HttpRouteParser();
  const routes = await fetchRoutes();

  const canHotreload = process.env.HOT_RELOAD_ROUTES == "true";
  if (canHotreload) {
    // register to chan:on-route-change signal from redis event
    console.log("routes hot reloading enabled");
    subscribeToChannel(CHAN_ON_ROUTE_CHANGE, async () => {
      const fetchedRoutes = await fetchRoutes();
      // @ts-ignore
      parser.rebuildRoutes(fetchedRoutes);
      console.log("reloaded routes from db");
    });
  }

  // @ts-ignore
  parser.buildRoutes(routes);
  return parser;
}

async function fetchRoutes() {
  return await db
    .select({
      method: routesEntity.method,
      path: routesEntity.path,
      routeId: routesEntity.id,
    })
    .from(routesEntity);
}
