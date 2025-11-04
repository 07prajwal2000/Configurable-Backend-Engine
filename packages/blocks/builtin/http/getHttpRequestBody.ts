import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";

export const getHttpRequestBodyBlockSchema = z.any();

export class GetHttpRequestBodyBlock extends BaseBlock {
  override async executeAsync(): Promise<BlockOutput> {
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: this.context.requestBody,
    };
  }
}
