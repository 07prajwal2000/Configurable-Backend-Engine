import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { DbAdapterMode, IDbAdapter } from "@cbe/adapters/db";
import { Engine } from "../../engine";

export const transactionDbBlockSchema = z.object({
  connection: z.string(),
  executor: z.uuidv7(),
});

export class TransactionBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof transactionDbBlockSchema>,
    protected readonly childEngine: Engine,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(): Promise<BlockOutput> {
    try {
      this.dbAdapter.setMode(DbAdapterMode.TRANSACTION);
      const result = await this.childEngine.start(this.input.executor);
      await this.dbAdapter.commitTransaction();
      return result
        ? result
        : {
            continueIfFail: false,
            successful: false,
            error: "failed to execute transaction block",
          };
    } catch (error) {
      await this.dbAdapter.rollbackTransaction();
      return {
        continueIfFail: false,
        successful: false,
        error: "failed to execute transaction block",
      };
    }
  }
}
