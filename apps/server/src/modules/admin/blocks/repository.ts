import { db } from "../../../db";
import { blocksEntity, routesEntity } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { BlockType } from "./dto";

export async function createBlock(data: BlockType) {
  const result = await db.insert(blocksEntity).values(data).returning();
  return result[0];
}

export async function getBlockById(id: string) {
  const result = await db
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.id, id));
  return result[0] || null;
}

export async function getAllBlocks() {
  return await db.select().from(blocksEntity);
}

export async function updateBlock(id: string, data: Partial<BlockType>) {
  const result = await db
    .update(blocksEntity)
    .set(data)
    .where(eq(blocksEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteBlock(id: string) {
  const result = await db
    .delete(blocksEntity)
    .where(eq(blocksEntity.id, id))
    .returning();
  return result[0] || null;
}
