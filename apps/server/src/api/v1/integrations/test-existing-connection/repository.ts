import { eq } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { integrationsEntity } from "../../../../db/schema";

export async function getIntegrationById(id: string, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select()
    .from(integrationsEntity)
    .where(eq(integrationsEntity.id, id));
  return result[0];
}
