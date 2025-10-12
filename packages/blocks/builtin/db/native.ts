import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { IDbAdapter } from "@cbe/adapters/db";

export const nativeDbBlockSchema = z.object({
  js: z.string().refine((val) => val.startsWith("js:")),
  connection: z.string(),
});

export class NativeDbBlock extends BaseBlock {
  constructor(
    protected readonly context: Context,
    private readonly dbAdapter: IDbAdapter,
    protected readonly input: z.infer<typeof nativeDbBlockSchema>,
    public readonly next?: string
  ) {
    super(context, input, next);
  }

  public async executeAsync(): Promise<BlockOutput> {
    try {
      this.context.vars.dbQuery = this.dbAdapter.raw;
      const value = await this.context.vm.runAsync(`
        (async () => {${this.input.js}})();
      `);
      return {
        continueIfFail: false,
        successful: true,
        next: this.next,
        output: value,
      };
    } catch {
      return {
        continueIfFail: false,
        successful: false,
        error: "failed to execute get single db block",
      };
    } finally {
      this.context.vars.dbQuery = undefined;
    }
  }
}
