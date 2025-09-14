import { BlockBuilder, BlockOutput, Context, Engine } from "@cbe/blocks";
import { db } from "../db";
import { blocksEntity, edgesEntity } from "../db/schema";
import { eq } from "drizzle-orm";

export async function startBlocksExecution(routeId: string, context: Context) {
  const builder = new BlockBuilder(context, {
    create(builder, executor) {
      return new Engine(builder.buildGraph(executor));
    },
  });

  // Load blocks and edges from database
  const { blocks, edges } = await loadBlocksAndEdgesFromDatabase(routeId);

  builder.loadBlocks(blocks);
  builder.loadEdges(edges);
  const entrypoint = builder.getEntrypoint();
  const graph = builder.buildGraph(entrypoint);
  // console.log(graph);
  const engine = new Engine(graph);
  const executionResult = await engine.start(entrypoint, context.requestBody);
  return executionResult;
}

async function loadBlocksAndEdgesFromDatabase(routeId: string) {
  // Load blocks for the route
  const blocksResult = await db
    .select()
    .from(blocksEntity)
    .where(eq(blocksEntity.routeId, routeId));

  // Filter out blocks with null types and ensure proper typing
  const blocks = blocksResult
    .filter((block) => block.type !== null)
    .map((block) => ({
      id: block.id,
      type: block.type as any, // BlockTypes will be handled by the BlockBuilder
      position: block.position as { x: number; y: number },
      data: block.data,
    }));

  // Load edges for the route using left join
  // Since edges don't have direct route reference, we join with blocks
  // to find edges where either the 'from' or 'to' block belongs to the route
  const edgesResult = await db
    .select({
      id: edgesEntity.id,
      from: edgesEntity.from,
      to: edgesEntity.to,
      fromHandle: edgesEntity.fromHandle,
      toHandle: edgesEntity.toHandle,
    })
    .from(edgesEntity)
    .leftJoin(blocksEntity, eq(edgesEntity.from, blocksEntity.id))
    .where(eq(blocksEntity.routeId, routeId));

  // Filter out edges with null values and ensure proper typing
  const edges = edgesResult.map((edge) => ({
    id: edge.id as string,
    from: edge.from as string,
    to: edge.to as string,
    fromHandle: edge.toHandle as string,
    toHandle: edge.fromHandle as string,
  }));

  return {
    blocks,
    edges,
  };
}
