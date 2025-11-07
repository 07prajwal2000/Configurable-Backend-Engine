import { baseBlockDataSchema, BaseBlock, BlockOutput } from "../../baseBlock";
import z from "zod";

export const setHttpHeaderBlockSchema = z
  .object({
    name: z.string(),
    value: z.string(),
  })
  .extend(baseBlockDataSchema.shape);

export class SetHttpHeaderBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof setHttpHeaderBlockSchema>;
    input.value = input.value.startsWith("js:")
      ? this.context.vm.run(input.value.slice(3))
      : input.value;
    this.context.vars.setHeader(input.name, input.value);
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: params,
    };
  }
}
