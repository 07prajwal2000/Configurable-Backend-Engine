import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";

export const getHttpParamBlockSchema = z.object({
  name: z.string(),
  source: z.enum(["query", "path"]),
});

export class GetHttpParamBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof getHttpParamBlockSchema>;
    let source = this.context.vars.requestHttpParams;
    if (input.source === "path") {
      source = this.context.vars.requestHttpPathParams;
    }
    const value = source[input.name];
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: value,
    };
  }
}
