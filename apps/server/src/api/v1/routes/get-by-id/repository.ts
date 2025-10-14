import { eq } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { routesEntity } from "../../../../db/schema";

export async function getRouteById(id: string, tx?: DbTransactionType) {
  const route = await (tx ?? db)
    .select()
    .from(routesEntity)
    .where(eq(routesEntity.id, id))
    .limit(1);
  return route.length > 0 ? route[0] : null;
}
