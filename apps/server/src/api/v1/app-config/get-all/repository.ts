import { db, DbTransactionType } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";
import { count } from "drizzle-orm";

export async function getAppConfigList(
  skip: number,
  take: number,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select({
      id: appConfigEntity.id,
      keyName: appConfigEntity.keyName,
      description: appConfigEntity.description,
      value: appConfigEntity.value,
      isEncrypted: appConfigEntity.isEncrypted,
      encodingType: appConfigEntity.encodingType,
      createdAt: appConfigEntity.createdAt,
      updatedAt: appConfigEntity.updatedAt,
    })
    .from(appConfigEntity)
    .offset(skip)
    .limit(take);

  const totalCount = await getAppConfigCount(tx);

  return { result, totalCount };
}

export async function getAppConfigCount(tx?: DbTransactionType) {
  const totalCount = await (tx ?? db)
    .select({
      count: count(appConfigEntity.id),
    })
    .from(appConfigEntity);
  return totalCount[0].count;
}
