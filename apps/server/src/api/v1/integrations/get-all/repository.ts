import { db, DbTransactionType } from "../../../../db";
import { integrationsEntity } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function getAllIntegrationsByGroup(
  group: string,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select()
    .from(integrationsEntity)
    .where(eq(integrationsEntity.group, group));
  return result;
}
