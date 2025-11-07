import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  Context,
} from "../../baseBlock";
import type { IDbAdapter } from "@cbe/adapters/db";
import { whereConditionSchema } from "./schema";

export const getAllDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    conditions: z.array(whereConditionSchema),
    limit: z.number().default(1000),
  })
  .extend(baseBlockDataSchema.shape);

export class GetAllDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof getAllDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(): Promise<BlockOutput> {
    try {
      const result = await this.dbAdapter.getAll(
        this.input.tableName,
        this.input.conditions,
        this.input.limit ?? 1000
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
        error: "failed to execute get all db block",
      };
    }
  }
}
