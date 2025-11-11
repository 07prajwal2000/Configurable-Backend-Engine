import { createInsertSchema } from "drizzle-zod";
import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

const createSchema = createInsertSchema(appConfigEntity);

export async function createAppConfig(
  data: z.infer<typeof createSchema>,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .insert(appConfigEntity)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return result.length > 0 ? result[0] : null;
}

export async function keyExists(keyName: string, tx?: DbTransactionType) {
  const result = await (tx ?? db)
    .select({ id: appConfigEntity.id })
    .from(appConfigEntity)
    .where(eq(appConfigEntity.keyName, keyName))
    .limit(1);
  return result.length > 0;
}
