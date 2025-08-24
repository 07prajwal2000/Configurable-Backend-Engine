import fs from "fs";
import { BlockBuilder, BlockOutput, Context, Engine } from "@cbe/blocks";

export async function startBlocksExecution(
  requestId: string,
  context: Context
) {
  const builder = new BlockBuilder(context, {
    create(builder, executor) {
      return new Engine(builder.buildGraph(executor));
    },
  });
  // TODO: load blocks and edges from DB/redis
  const { blocks, edges } = await loadDummyData();
  builder.loadBlocks(blocks);
  builder.loadEdges(edges);
  const entrypoint = builder.getEntrypoint();
  const graph = builder.buildGraph(entrypoint);
  const engine = new Engine(graph);
  return await engine.start(entrypoint, context.requestBody);
}

async function loadDummyData() {
  const data = await fs.readFileSync(
    "D:\\Programming Files\\OSS\\CBE\\apps\\demos\\block-data.json"
  );
  const json = JSON.parse(data.toString());
  return {
    blocks: json.blocks,
    edges: json.edges,
  };
}
