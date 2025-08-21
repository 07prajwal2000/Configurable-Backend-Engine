import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const getVarBlockSchema = z.object({
  key: z.string(),
});

export class GetVarBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const { data, success } = getVarBlockSchema.safeParse(this.input);
    if (!success) {
      return {
        continueIfFail: true,
        successful: false,
        next: this.next,
        output: null,
      };
    }
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: this.context.vars[data.key],
    };
  }
}
