import { count, desc, ne } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { projectsEntity } from "../../../../db/schema";

export async function getProjectsList(
  skip: number,
  limit: number,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select()
    .from(projectsEntity)
    .where(ne(projectsEntity.name, "__personal"))
    .orderBy(desc(projectsEntity.updatedAt))
    .offset(skip)
    .limit(limit);
  const totalCount = await getTotalCount();
  return {
    data: result,
    totalCount,
  };
}

export async function getTotalCount() {
  const result = await db
    .select({ count: count(projectsEntity.id) })
    .from(projectsEntity);
  return result[0].count;
}
