import { db, DbTransactionType } from "../../../../db";
import { integrationsEntity } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function getIntegrationByID(id: string, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select()
    .from(integrationsEntity)
    .where(eq(integrationsEntity.id, id));
  return result.length > 0 ? result[0] : null;
}
