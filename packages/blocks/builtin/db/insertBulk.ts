import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  Context,
} from "../../baseBlock";
import type { IDbAdapter } from "@fluxify/adapters/db";

export const insertBulkDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    data: z.array(z.object()),
    useParam: z.boolean(),
  })
  .extend(baseBlockDataSchema.shape);

export class InsertBulkDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof insertBulkDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(data: object[]): Promise<BlockOutput> {
    try {
      const dataToInsert = this.input.useParam ? data : this.input.data;
      const result = await this.dbAdapter.insertBulk(
        this.input.tableName,
        dataToInsert
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
        error: "failed to execute insert bulk db block",
      };
    }
  }
}
