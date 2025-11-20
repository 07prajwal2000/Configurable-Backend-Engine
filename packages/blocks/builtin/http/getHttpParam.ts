import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";
import { baseBlockDataSchema } from "../../baseBlock";

export const getHttpParamBlockSchema = z
  .object({
    name: z.string(),
    source: z.enum(["query", "path"]),
  })
  .extend(baseBlockDataSchema.shape);

export class GetHttpParamBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof getHttpParamBlockSchema>;
    input.name = input.name.startsWith("js:")
      ? ((await this.context.vm.runAsync(input.name.slice(3))) as string)
      : input.name;
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
