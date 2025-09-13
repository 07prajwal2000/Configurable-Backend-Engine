import { db } from "../../../db";
import { routesEntity } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { RouteType } from "./dto";

export async function createRoute(data: RouteType) {
  // Convert string method to enum if needed
  const routeData = {
    ...data,
    method: data.method as any,
  };

  const result = await db.insert(routesEntity).values(routeData).returning();
  return result[0];
}

export async function getRouteById(id: string) {
  const result = await db
    .select()
    .from(routesEntity)
    .where(eq(routesEntity.id, id));
  return result[0] || null;
}

export async function getAllRoutes() {
  return await db.select().from(routesEntity);
}

export async function updateRoute(id: string, data: Partial<RouteType>) {
  // Convert string method to enum if needed
  const routeData = {
    ...data,
    method: data.method as any,
  };

  const result = await db
    .update(routesEntity)
    .set(routeData)
    .where(eq(routesEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteRoute(id: string) {
  const result = await db
    .delete(routesEntity)
    .where(eq(routesEntity.id, id))
    .returning();
  return result[0] || null;
}
