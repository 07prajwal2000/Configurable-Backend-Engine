import { eq } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";

export async function getAppConfigById(id: number, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.id, id))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return result[0];
}
