import { BlockBuilder, BlockOutput, Context, Engine } from "@cbe/blocks";

export async function startBlocksExecution(
  requestId: string,
  context: Context
): Promise<BlockOutput> {
  const builder = new BlockBuilder(context, {
    create(builder, executor) {
      return new Engine(builder.buildGraph(executor));
    },
  });
  // TODO: load blocks and edges from DB/redis
  builder.loadBlocks([]);
  builder.loadEdges([]);
  const entrypoint = builder.getEntrypoint();
  const blocks = builder.buildGraph(entrypoint);
  const engine = new Engine(blocks);
  return await engine.start(entrypoint, context.requestBody);
}
