import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  Context,
} from "../../baseBlock";
import type { IDbAdapter } from "@fluxify/adapters";
import { whereConditionSchema } from "./schema";

export const getAllDbBlockSchema = z
  .object({
    connection: z.string(),
    tableName: z.string(),
    conditions: z.array(whereConditionSchema),
    limit: z.int().default(1000),
    offset: z.int().default(0),
    sort: z
      .object({
        attribute: z.string(),
        direction: z.enum(["asc", "desc"]),
      })
      .default({
        attribute: "id",
        direction: "asc",
      }),
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
      this.input.tableName = this.input.tableName.startsWith("js:")
        ? ((await this.context.vm.runAsync(
            this.input.tableName.slice(3)
          )) as string)
        : this.input.tableName;
      this.input.sort.attribute = this.input.sort.attribute.startsWith("js:")
        ? ((await this.context.vm.runAsync(
            this.input.sort.attribute.slice(3)
          )) as string)
        : this.input.sort.attribute;
      const result = await this.dbAdapter.getAll(
        this.input.tableName,
        this.input.conditions,
        this.input.limit ?? 1000,
        this.input.offset ?? 0,
        this.input.sort ?? {
          attribute: "id",
          direction: "asc",
        }
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
