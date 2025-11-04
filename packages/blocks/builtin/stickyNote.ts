import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const stickyNotesSchema = z.object({
  notes: z.string(),
});

export class stickyNoteBlock extends BaseBlock {
  public override async executeAsync(): Promise<BlockOutput> {
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
    };
  }
}
