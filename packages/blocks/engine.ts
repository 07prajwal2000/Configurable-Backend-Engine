import { BaseBlock, BlockOutput } from "./baseBlock";

type Blocks = {
  [id: string]: BaseBlock;
};

export class Engine {
  constructor(private readonly blocks: Blocks) {}
  public async start(
    blockId: string,
    params?: any
  ): Promise<BlockOutput | null> {
    let result: BlockOutput | null = null;
    const blocks = this.blocks;

    if (!(blockId in blocks)) throw new Error("Block not found");
    let block = blocks[blockId],
      nextParams = params;
    while (true) {
      result = await block.executeAsync(nextParams);
      if (!result || (!result.successful && !result.continueIfFail)) {
        throw new Error(result?.error || "Unknown error");
      }
      nextParams = await result.output;
      if (!result.next) break;
      block = blocks[result.next];
    }
    return result;
  }
}
