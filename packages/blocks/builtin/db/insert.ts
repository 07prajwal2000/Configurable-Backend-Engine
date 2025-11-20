import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  Context,
} from "../../baseBlock";
import { IDbAdapter } from "@fluxify/adapters";

export const insertDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    data: z.object({
      source: z.enum(["raw", "js"]),
      value: z.object(),
    }),
    useParam: z.boolean(),
  })
  .extend(baseBlockDataSchema.shape);

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
      let dataToInsert = this.input.useParam ? data : this.input.data.value;
      if (
        !this.input.useParam &&
        this.input.data.source === "js" &&
        typeof this.input.data.value === "string"
      ) {
        dataToInsert = (await this.context.vm.runAsync(
          this.input.data.value
        )) as object;
      }
      if (!(dataToInsert instanceof Object)) {
        return {
          continueIfFail: false,
          successful: false,
          error: "error in insert: data to insert is not an object",
        };
      }
      this.input.tableName = this.input.tableName.startsWith("js:")
        ? ((await this.context.vm.runAsync(
            this.input.tableName.slice(3)
          )) as string)
        : this.input.tableName;
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
