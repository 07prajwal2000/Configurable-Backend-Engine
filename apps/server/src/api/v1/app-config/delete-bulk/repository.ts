import { inArray } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";

export async function deleteAppConfigBulk(
  ids: number[],
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .delete(appConfigEntity)
    .where(inArray(appConfigEntity.id, ids))
    .returning();
  return result.length;
}

export async function checkAppConfigsExist(
  ids: number[],
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select({ id: appConfigEntity.id })
    .from(appConfigEntity)
    .where(inArray(appConfigEntity.id, ids));
  return result.length > 0;
}
