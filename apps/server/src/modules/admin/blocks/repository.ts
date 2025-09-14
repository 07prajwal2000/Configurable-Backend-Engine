import { db } from "../../../db";
import { blocksEntity, routesEntity } from "../../../db/schema";
import { eq, sql } from "drizzle-orm";
import { BlockType } from "./dto";

export async function createBlock(data: BlockType, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance.insert(blocksEntity).values(data).returning();
  return result[0];
}

export async function getBlockById(id: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.id, id));
  return result[0] || null;
}

export async function getAllBlocks(limit: number, offset: number, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select()
    .from(blocksEntity)
    .limit(limit)
    .offset(offset);
  return result;
}

export async function getTotalBlocksCount(tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select({ count: sql<number>`count(*)` })
    .from(blocksEntity);
  return result[0].count;
}

export async function getBlocksByRouteId(routeId: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.routeId, routeId));
  return result;
}

export async function updateBlock(
  id: string,
  data: Partial<BlockType>,
  tx?: any
) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .update(blocksEntity)
    .set(data)
    .where(eq(blocksEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteBlock(id: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .delete(blocksEntity)
    .where(eq(blocksEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function upsertBlock(data: BlockType, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .insert(blocksEntity)
    .values(data)
    .onConflictDoUpdate({
      target: blocksEntity.id,
      set: {
        type: data.type,
        position: data.position,
        data: data.data,
        updatedAt: data.updatedAt,
        routeId: data.routeId,
      },
    })
    .returning();
  return result[0];
}
