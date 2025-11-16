import z from "zod";
import {
  BaseBlock,
  baseBlockDataSchema,
  BlockOutput,
  Context,
} from "../../baseBlock";
import type { IDbAdapter } from "@fluxify/adapters/db";
import { whereConditionSchema } from "./schema";

export const deleteDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    conditions: z.array(whereConditionSchema),
  })
  .extend(baseBlockDataSchema.shape);

export class DeleteDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof deleteDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(): Promise<BlockOutput> {
    try {
      const result = await this.dbAdapter.delete(
        this.input.tableName,
        this.input.conditions
      );
      return {
        continueIfFail: false,
        successful: true,
        output: result,
        next: this.next,
      };
    } catch {
      return {
        continueIfFail: false,
        successful: false,
        error: "failed to execute delete db block",
      };
    }
  }
}
