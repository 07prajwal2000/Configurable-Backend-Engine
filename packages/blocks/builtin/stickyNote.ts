import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const setVarSchema = z.object({
  notes: z.string(),
});

export class SetVarBlock extends BaseBlock {
  public override async executeAsync(): Promise<BlockOutput> {
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
    };
  }
}
