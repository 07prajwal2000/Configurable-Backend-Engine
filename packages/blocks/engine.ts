import { BaseBlock } from "./baseBlock";

type Blocks = {
  [id: string]: BaseBlock;
};

export class Engine {
  constructor(private readonly blocks: Blocks) {
    console.log("new");
  }
  public async start(blockId: string, params?: any): Promise<void> {
    const blocks = this.blocks;
    if (!(blockId in blocks)) throw new Error("Block not found");
    let block = blocks[blockId],
      nextParams = params;
    while (true) {
      const result = await block.executeAsync(nextParams);
      if (!result.successful && !result.continueIfFail) {
        throw new Error(result.error);
      }
      nextParams = await result.output;
      if (!block.next) break;
      block = blocks[block.next];
    }
    return nextParams;
  }
}
