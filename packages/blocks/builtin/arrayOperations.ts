import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const filterArrayOpSchema = z.object({});

export const arrayOperationsBlockSchema = z.object({
  type: z.enum(["filter", "push", "pop", "shift", "unshift"]),
});

export class ArrayOperationsBlock extends BaseBlock {
  public executeAsync(params?: any): Promise<BlockOutput> {
    throw new Error("Method not implemented.");
  }
}
