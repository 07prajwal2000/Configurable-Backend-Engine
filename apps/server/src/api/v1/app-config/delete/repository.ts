import { eq } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";

export async function deleteAppConfig(id: number, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .delete(appConfigEntity)
    .where(eq(appConfigEntity.id, id))
    .returning();
  return result.length > 0;
}

export async function checkAppConfigExist(id: number, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select({ id: appConfigEntity.id })
    .from(appConfigEntity)
    .where(eq(appConfigEntity.id, id))
    .limit(1);
  return result.length === 1;
}
