import { count, desc, SQL } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { routesEntity } from "../../../../db/schema";

export async function getRoutesList(
  skip: number,
  limit: number,
  filter?: SQL<unknown>,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select()
    .from(routesEntity)
    .where(filter)
    .offset(skip)
    .orderBy(desc(routesEntity.updatedAt))
    .limit(limit);
  const totalCount = await getRoutesCount(filter, tx);
  return { result, totalCount };
}

async function getRoutesCount(filter?: SQL<unknown>, tx?: DbTransactionType) {
  const totalCount = await (tx ?? db)
    .select({
      count: count(routesEntity.id),
    })
    .from(routesEntity)
    .where(filter);
  return totalCount[0].count;
}
