import { createInsertSchema } from "drizzle-zod";
import { db, DbTransactionType } from "../../../../db";
import { blocksEntity, edgesEntity, routesEntity } from "../../../../db/schema";
import z from "zod";
import { Column, eq, inArray, sql } from "drizzle-orm";
import { PgTable, PgUpdateSetSource } from "drizzle-orm/pg-core";

const insertBlocksSchema = createInsertSchema(blocksEntity);
const insertEntitySchema = createInsertSchema(edgesEntity);

export async function upsertBlocks(
  blocks: z.infer<typeof insertBlocksSchema>[],
  tx?: DbTransactionType
) {
  await (tx ?? db)
    .insert(blocksEntity)
    .values(blocks)
    .onConflictDoUpdate({
      target: blocksEntity.id,
      set: {
        type: sql`excluded.type`,
        position: sql`excluded.position`,
        data: sql`excluded.data`,
        updatedAt: sql`excluded.updatedAt`,
        routeId: sql`excluded.routeId`,
        createdAt: sql`excluded.createdAt`,
      },
    });
}

export async function deleteBlocks(blockIds: string[], tx?: DbTransactionType) {
  await (tx ?? db)
    .delete(blocksEntity)
    .where(inArray(blocksEntity.id, blockIds));
}

export async function upsertEdges(
  edges: z.infer<typeof insertEntitySchema>[],
  tx?: DbTransactionType
) {
  await (tx ?? db)
    .insert(edgesEntity)
    .values(edges)
    .onConflictDoUpdate({
      target: [edgesEntity.id],
      set: {},
    });
}

export async function deleteEdges(edgeIds: string[], tx?: DbTransactionType) {
  await (tx ?? db).delete(edgesEntity).where(inArray(edgesEntity.id, edgeIds));
}

export async function routeExist(routeId: string, tx?: DbTransactionType) {
  const route = await (tx ?? db)
    .select({
      id: routesEntity.id,
    })
    .from(routesEntity)
    .where(eq(routesEntity.id, routeId))
    .limit(1);
  return route.length > 0;
}

function conflictUpdateSet<TTable extends PgTable>(
  table: TTable,
  columns: (keyof TTable["_"]["columns"] & keyof TTable)[]
): PgUpdateSetSource<TTable> {
  return Object.assign(
    {},
    ...columns.map((k) => ({
      [k]: sql.raw(`'excluded.${(table[k] as Column).name}'`),
    }))
  ) as PgUpdateSetSource<TTable>;
}
