import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";

export const getHttpHeaderBlockSchema = z.object({
  name: z.string(),
});

export class GetHttpHeaderBlock extends BaseBlock {
  override async executeAsync(): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof getHttpHeaderBlockSchema>;
    const header = this.context.vars.requestHttpHeaders[input.name];
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: header,
    };
  }
}
