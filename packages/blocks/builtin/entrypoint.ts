import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const entrypointBlockSchema = z.any().default({});

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
