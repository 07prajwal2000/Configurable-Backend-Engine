import z from "zod";
import { BaseBlock, baseBlockDataSchema, BlockOutput } from "../baseBlock";

export const entrypointBlockSchema = z.object(baseBlockDataSchema.shape);

export class EntrypointBlock extends BaseBlock {
  async executeAsync(params?: any): Promise<BlockOutput> {
    return {
      continueIfFail: true,
      successful: true,
      output: params,
      next: this.next,
    };
  }
}
