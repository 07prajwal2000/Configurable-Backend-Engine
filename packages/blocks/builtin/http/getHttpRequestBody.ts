import { BaseBlock, BlockOutput } from "../../baseBlock";

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
