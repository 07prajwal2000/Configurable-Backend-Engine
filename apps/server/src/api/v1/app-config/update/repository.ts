import { eq } from "drizzle-orm";
import { DbTransactionType, db } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";

const updateSchema = createUpdateSchema(appConfigEntity);

export async function updateAppConfig(
  id: number,
  data: z.infer<typeof updateSchema>,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .update(appConfigEntity)
    .set(data)
    .where(eq(appConfigEntity.id, id))
    .returning();
  return result.length > 0 ? result[0] : null;
}

export async function getConfigById(id: number, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getConfigByKeyName(
  keyName: string,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select({ id: appConfigEntity.id })
    .from(appConfigEntity)
    .where(eq(appConfigEntity.keyName, keyName))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}
