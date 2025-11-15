import { db, DbTransactionType } from "../../../../db";
import { integrationsEntity } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function deleteIntegration(id: string, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .delete(integrationsEntity)
    .where(eq(integrationsEntity.id, id))
    .returning();
  return result.length;
}
