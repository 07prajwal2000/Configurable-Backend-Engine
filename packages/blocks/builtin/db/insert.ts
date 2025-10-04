import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { IDbAdapter } from "@cbe/adapters/db";

export const insertDbBlockSchema = z.object({
  tableName: z.string(),
  data: z.object(),
  useParam: z.boolean(),
});

export class InsertDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof insertDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(data: object): Promise<BlockOutput> {
    try {
      const dataToInsert = this.input.useParam ? data : this.input.data;
      const result = await this.dbAdapter.insert(
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
        error: "failed to execute insert db block",
      };
    }
  }
}
