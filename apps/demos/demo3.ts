import { BlockBuilder, BlocksListDTOSchemaType, Engine } from "@fluxify/blocks";
import { Context, ContextVarsType } from "@fluxify/blocks/baseBlock";
import { JsVM } from "@fluxify/lib/vm";
import fs from "fs";

const { blocks, edges } = JSON.parse(
  fs
    .readFileSync(
      "D:\\Programming Files\\OSS\\CBE\\apps\\demos\\block-data.json"
    )
    .toString()
);

const vars: ContextVarsType = {
  httpRequestQuery: {},
  httpRequestMethod: {},
  httpRequestCookies: {},
  httpRequestHeaders: {},
  httpRequestRoute: {},
  responseHttpHeaders: {},
};
const vm = new JsVM(vars);
const context: Context = {
  apiId: "api_id",
  route: "/api/users",
  vars,
  vm,
};
const builder = new BlockBuilder(
  context,
  {
    create(builder: BlockBuilder, executor: string) {
      const builtBlocks = builder.buildGraph(executor);
      return new Engine(builtBlocks || {});
    },
  },
  true
);
async function main() {
  builder.loadEdges(edges);
  builder.loadBlocks(blocks);
  const builtBlocks = builder.buildGraph(builder.getEntrypoint());
  const engine = new Engine(builtBlocks || {});
  const output = await engine.start(builder.getEntrypoint());
  console.log(output);
}
main();
