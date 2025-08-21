import z from "zod";
import { BaseBlock, Context } from "./baseBlock";
import { BlockTypes } from "./blockTypes";
import { IfBlock } from "./builtin/if";
import { JsRunnerBlock } from "./builtin/jsRunner";
import { ConsoleLoggerBlock } from "./builtin/log/console";
import { SetVarBlock } from "./builtin/setVar";
import { TransformerBlock } from "./builtin/transformer";
import { ForEachLoopBlock } from "./builtin/loops/foreach";
import { Engine } from "./engine";
import { ForLoopBlock } from "./builtin/loops/for";
import { GetVarBlock } from "./builtin/getVar";
import { ResponseBlock } from "./builtin/response";
import { EntrypointBlock } from "./builtin/entrypoint";

export const blockDTOSchema = z.object({
  id: z.uuidv7(),
  type: z.enum(BlockTypes),
  data: z.any(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const blocksListDTOSchema = z.array(blockDTOSchema);

export const edgeDTOSchema = z.array(
  z.object({
    id: z.uuidv7(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string(),
    targetHandle: z.string(),
  })
);
export type BlockDTOType = z.infer<typeof blockDTOSchema>;
export type BlocksListDTOSchemaType = z.infer<typeof blocksListDTOSchema>;
export type EdgeDTOSchemaType = z.infer<typeof edgeDTOSchema>;

type EdgesType = Record<
  string,
  [
    {
      target: string;
      handle: string;
    }
  ]
>;

export class BlockBuilder {
  private edgesMap: EdgesType = {};
  private entrypointId = "";
  constructor(private readonly context: Context) {}

  // building graph's edges
  public loadEdges(edges: EdgeDTOSchemaType) {
    const edgesMap: EdgesType = {};
    for (const edge of edges) {
      const handle = edge.targetHandle.slice(
        edge.targetHandle.lastIndexOf("-")
      );
      if (handle == BlockTypes.entrypoint) {
        this.entrypointId = edge.target;
      }
      const outgoing = {
        target: edge.target,
        handle,
      };
      if (edge.target in edgesMap) {
        edgesMap[edge.target].push(outgoing);
      } else {
        edgesMap[edge.target] = [outgoing];
      }
    }
    this.edgesMap = edgesMap;
  }
  public getEdges() {
    return this.edgesMap;
  }

  public buildBlocksGraph(blocks: BlocksListDTOSchemaType) {
    const blocksMap: { [id: string]: BaseBlock } = {};
    for (const block of blocks) {
      switch (block.type) {
        case BlockTypes.if:
          blocksMap[block.id] = this.createIfBlock(block);
          break;
        case BlockTypes.entrypoint:
          blocksMap[block.id] = this.createEntrypointBlock(block);
          break;
        case BlockTypes.forloop:
          blocksMap[block.id] = this.createForLoopBlock(block);
          break;
        case BlockTypes.foreachloop:
          blocksMap[block.id] = this.createForEachLoopBlock(block);
          break;
        case BlockTypes.transformer:
          blocksMap[block.id] = this.createTransformerBlock(block);
          break;
        case BlockTypes.setvar:
          blocksMap[block.id] = this.createSetVarBlock(block);
          break;
        case BlockTypes.getvar:
          blocksMap[block.id] = this.createGetVarBlock(block);
          break;
        case BlockTypes.consolelog:
          blocksMap[block.id] = this.createConsoleLogBlock(block);
          break;
        case BlockTypes.jsrunner:
          blocksMap[block.id] = this.createJsRunnerBlock(block);
          break;
        case BlockTypes.response:
          blocksMap[block.id] = this.createResponseBlock(block);
          break;
      }
    }
    return blocksMap;
  }
  createIfBlock(block: BlockDTOType) {
    const successBlock = this.findEdge(block, "success");
    const failureBlock = this.findEdge(block, "failure");
    return new IfBlock(successBlock, failureBlock, this.context, block.data);
  }
  createJsRunnerBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new JsRunnerBlock(this.context, block.data, edge);
  }
  createConsoleLogBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new ConsoleLoggerBlock(this.context, block.data, edge);
  }
  createSetVarBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new SetVarBlock(this.context, block.data, edge);
  }
  createTransformerBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new TransformerBlock(this.context, block.data, edge);
  }
  createForEachLoopBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    const executor = this.findEdge(block, "executor");
    const engine = this.createEngine(executor);
    return new ForEachLoopBlock(this.context, block.data, engine, edge);
  }
  createEngine(edge: string) {
    return new Engine({});
  }
  createForLoopBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    const executor = this.findEdge(block, "executor");
    const engine = this.createEngine(executor);
    return new ForLoopBlock(this.context, block.data, engine, edge);
  }
  createResponseBlock(block: BlockDTOType): BaseBlock {
    return new ResponseBlock(this.context, block.data);
  }
  createGetVarBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new GetVarBlock(this.context, block.data, edge);
  }
  createEntrypointBlock(block: BlockDTOType): BaseBlock {
    const edge = this.findEdge(block, "target");
    return new EntrypointBlock(this.context, block.data);
  }
  // TODO: Optimize it
  findEdge(block: BlockDTOType, handleType: string) {
    const edge = this.edgesMap[block.id]?.find(
      (edge) => edge.handle == handleType
    );
    return edge?.target || "";
  }
}
