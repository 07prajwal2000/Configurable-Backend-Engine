import { createInsertSchema } from "drizzle-zod";
import { appConfigEntity, integrationsEntity } from "../../../../db/schema";
import { z } from "zod";
import { db, DbTransactionType } from "../../../../db";
import { eq } from "drizzle-orm";

const schema = createInsertSchema(integrationsEntity);

export async function createIntegration(
  data: z.infer<typeof schema>,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db).insert(integrationsEntity).values(data);
  return result;
}

export async function integrationExistByName(
  name: string,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select()
    .from(integrationsEntity)
    .where(eq(integrationsEntity.name, name))
    .limit(1);
  return result.length > 0;
}

export async function getAppConfigKeys(tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select({ key: appConfigEntity.keyName })
    .from(appConfigEntity);
  return result.map((item) => item.key);
}
