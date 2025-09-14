import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";

export const getHttpParamBlockSchema = z.object({
  name: z.string(),
  source: z.enum(["query", "path"]),
});

export class GetHttpParamBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof getHttpParamBlockSchema>;
    let value = this.context.vars.getQueryParam(input.name);
    if (input.source === "path") {
      value = this.context.vars.getRouteParam(input.name);
    }
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: value,
    };
  }
}
