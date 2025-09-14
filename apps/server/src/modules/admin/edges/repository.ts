import { db } from "../../../db";
import { edgesEntity, blocksEntity } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { EdgeType } from "./dto";

export async function createEdge(data: EdgeType) {
  const result = await db.insert(edgesEntity).values(data).returning();
  return result[0];
}

export async function getEdgeById(id: string) {
  const result = await db
    .select()
    .from(edgesEntity)
    .where(eq(edgesEntity.id, id));
  return result[0] || null;
}

export async function getEdgesByRouteId(routeId: string) {
  // Get all edges first
  const edges = await db
    .select()
    .from(edgesEntity)
    .innerJoin(blocksEntity, eq(edgesEntity.from, blocksEntity.id))
    .where(eq(blocksEntity.routeId, routeId));

  // For each edge, get the from and to block information
  const result = await Promise.all(
    edges.map(async (edge) => {
      const [fromBlock, toBlock] = await Promise.all([
        edge.edges.from
          ? db
              .select()
              .from(blocksEntity)
              .where(eq(blocksEntity.id, edge.edges.from))
              .then((res) => res[0] || null)
          : Promise.resolve(null),
        edge.edges.to
          ? db
              .select()
              .from(blocksEntity)
              .where(eq(blocksEntity.id, edge.edges.to))
              .then((res) => res[0] || null)
          : Promise.resolve(null),
      ]);

      return {
        id: edge.edges.id,
        from: edge.edges.from,
        to: edge.edges.to,
        fromHandle: edge.edges.fromHandle,
        toHandle: edge.edges.toHandle,
        fromBlock,
        toBlock,
      };
    })
  );

  return result;
}

export async function updateEdge(id: string, data: Partial<EdgeType>) {
  const result = await db
    .update(edgesEntity)
    .set(data)
    .where(eq(edgesEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteEdge(id: string) {
  const result = await db
    .delete(edgesEntity)
    .where(eq(edgesEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function getBlockById(blockId: string) {
  const result = await db
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.id, blockId));
  return result[0] || null;
}
