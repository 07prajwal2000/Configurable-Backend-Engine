import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  Context,
} from "../../baseBlock";
import type { IDbAdapter } from "@cbe/adapters/db";
import { whereConditionSchema } from "./schema";

export const updateDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    data: z.object(),
    conditions: z.array(whereConditionSchema),
    useParam: z.object(),
  })
  .extend(baseBlockDataSchema.shape);

export class UpdateDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof updateDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(data: object): Promise<BlockOutput> {
    try {
      const dataToUpdate = this.input.useParam ? data : this.input.data;
      const result = await this.dbAdapter.update(
        this.input.tableName,
        dataToUpdate,
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
        error: "failed to execute update db block",
      };
    }
  }
}
