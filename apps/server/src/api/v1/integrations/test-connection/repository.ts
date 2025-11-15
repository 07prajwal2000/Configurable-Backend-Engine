import { inArray } from "drizzle-orm";
import { db } from "../../../../db";
import { appConfigEntity } from "../../../../db/schema";

export async function getAppConfigs(keys: string[]) {
  if (keys.length === 0) {
    return [];
  }
  const result = await db
    .select({
      key: appConfigEntity.keyName,
      value: appConfigEntity.value,
      isEncrypted: appConfigEntity.isEncrypted,
      encodingType: appConfigEntity.encodingType,
    })
    .from(appConfigEntity)
    .where(inArray(appConfigEntity.keyName, keys));

  return result;
}
