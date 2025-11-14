import { ilike } from "drizzle-orm";
import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";

export async function getKeysList(
  searchQuery?: string,
  tx?: DbTransactionType
) {
  const query = (tx ?? db)
    .select({ keyName: appConfigEntity.keyName })
    .from(appConfigEntity);
  if (searchQuery) {
    query.where(ilike(appConfigEntity.keyName, `%${searchQuery}%`));
  }
  const result = await query;
  return result;
}
