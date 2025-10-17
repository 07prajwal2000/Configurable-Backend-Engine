import { count, desc } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { routesEntity } from "../../../../db/schema";

export async function getRoutesList(
  skip: number,
  limit: number,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select()
    .from(routesEntity)
    .offset(skip)
    .orderBy(desc(routesEntity.createdAt))
    .limit(limit);
  const totalCount = await getRoutesCount(tx);
  return { result, totalCount };
}

async function getRoutesCount(tx?: DbTransactionType) {
  const totalCount = await (tx ?? db)
    .select({
      count: count(routesEntity.id),
    })
    .from(routesEntity);
  return totalCount[0].count;
}
