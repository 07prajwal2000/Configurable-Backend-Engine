import { db } from "../../../db";
import { edgesEntity, blocksEntity } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { EdgeType } from "./dto";

export async function createEdge(data: EdgeType, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance.insert(edgesEntity).values(data).returning();
  return result[0];
}

export async function getEdgeById(id: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select()
    .from(edgesEntity)
    .where(eq(edgesEntity.id, id));
  return result[0] || null;
}

export async function getEdgesByRouteId(routeId: string, tx?: any) {
  const dbInstance = tx || db;

  // Get all edges first
  const edges = await dbInstance
    .select()
    .from(edgesEntity)
    .innerJoin(blocksEntity, eq(edgesEntity.from, blocksEntity.id))
    .where(eq(blocksEntity.routeId, routeId));

  // For each edge, get the from and to block information
  const result = await Promise.all(
    edges.map(async (edge: any) => {
      const [fromBlock, toBlock] = await Promise.all([
        edge.edges.from
          ? dbInstance
              .select()
              .from(blocksEntity)
              .where(eq(blocksEntity.id, edge.edges.from))
              .then((res: any) => res[0] || null)
          : Promise.resolve(null),
        edge.edges.to
          ? dbInstance
              .select()
              .from(blocksEntity)
              .where(eq(blocksEntity.id, edge.edges.to))
              .then((res: any) => res[0] || null)
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

export async function updateEdge(
  id: string,
  data: Partial<EdgeType>,
  tx?: any
) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .update(edgesEntity)
    .set(data)
    .where(eq(edgesEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteEdge(id: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .delete(edgesEntity)
    .where(eq(edgesEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function getBlockById(blockId: string, tx?: any) {
  const dbInstance = tx || db;
  const result = await dbInstance
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.id, blockId));
  return result[0] || null;
}
