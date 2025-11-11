import { db } from "../../../db";
import { appConfigEntity, AppConfigEncodingTypes } from "../../../db/schema";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import { AppConfigType, PaginationInput } from "./dto";

export async function createAppConfig(data: AppConfigType) {
  const result = await db.insert(appConfigEntity).values(data).returning();
  return result[0];
}

export async function getAppConfigById(id: number) {
  const result = await db
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.id, id));
  return result[0] || null;
}

export async function getAppConfigNames() {
  const result = await db
    .select({
      name: appConfigEntity.keyName,
    })
    .from(appConfigEntity);
  return result.map((x) => x.name);
}

export async function getAppConfigByKey(keyName: string) {
  const result = await db
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.keyName, keyName));
  return result[0] || null;
}

export async function getAllAppConfigs(pagination?: PaginationInput) {
  if (!pagination) {
    return await db.select().from(appConfigEntity);
  }

  const { page, limit, search, sortBy, sortOrder } = pagination;
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  if (search) {
    whereClause = ilike(appConfigEntity.keyName, `%${search}%`);
  }

  const orderBy = sortOrder === "desc" ? desc : asc;
  let orderColumn;

  switch (sortBy) {
    case "keyName":
      orderColumn = appConfigEntity.keyName;
      break;
    case "createdAt":
      orderColumn = appConfigEntity.createdAt;
      break;
    case "updatedAt":
      orderColumn = appConfigEntity.updatedAt;
      break;
    default:
      orderColumn = appConfigEntity.createdAt;
  }

  const result = await db
    .select()
    .from(appConfigEntity)
    .where(whereClause)
    .orderBy(orderBy(orderColumn))
    .limit(limit)
    .offset(offset);

  // Get total count for pagination metadata
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(appConfigEntity)
    .where(whereClause);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: result,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function updateAppConfig(
  id: number,
  data: Partial<AppConfigType>
) {
  const result = await db
    .update(appConfigEntity)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(appConfigEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteAppConfig(id: number) {
  const result = await db
    .delete(appConfigEntity)
    .where(eq(appConfigEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteAppConfigByKey(keyName: string) {
  const result = await db
    .delete(appConfigEntity)
    .where(eq(appConfigEntity.keyName, keyName))
    .returning();
  return result[0] || null;
}

export async function upsertAppConfig(data: AppConfigType) {
  const result = await db
    .insert(appConfigEntity)
    .values(data)
    .onConflictDoUpdate({
      target: appConfigEntity.keyName,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();
  return result[0];
}

export async function getAppConfigsByKeys(keyNames: string[]) {
  return await db
    .select()
    .from(appConfigEntity)
    .where(sql`${appConfigEntity.keyName} IN ${keyNames}`);
}

export async function bulkCreateAppConfigs(data: AppConfigType[]) {
  if (data.length === 0) return [];

  const result = await db.insert(appConfigEntity).values(data).returning();
  return result;
}

export async function bulkUpdateAppConfigs(
  updates: Array<{ id: number; data: Partial<AppConfigType> }>
) {
  if (updates.length === 0) return [];

  const results = [];
  for (const update of updates) {
    const result = await updateAppConfig(update.id, update.data);
    if (result) {
      results.push(result);
    }
  }
  return results;
}

export async function bulkDeleteAppConfigs(ids: number[]) {
  if (ids.length === 0) return [];

  const result = await db
    .delete(appConfigEntity)
    .where(sql`${appConfigEntity.id} IN ${ids}`)
    .returning();
  return result;
}

export async function getEncryptedAppConfigs() {
  return await db
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.isEncrypted, true));
}

export async function getAppConfigsByEncodingType(
  encodingType: AppConfigEncodingTypes
) {
  return await db
    .select()
    .from(appConfigEntity)
    .where(eq(appConfigEntity.encodingType, encodingType));
}
