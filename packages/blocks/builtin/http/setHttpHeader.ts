import { BaseBlock, BlockOutput } from "../../baseBlock";
import z from "zod";

export const setHttpHeaderBlockSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export class SetHttpHeaderBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof setHttpHeaderBlockSchema>;
    this.context.vars.setHeader(input.name, input.value);
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: params,
    };
  }
}
