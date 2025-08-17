import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { Engine } from "../../engine";

export const forLoopBlockSchema = z.object({
  block: z.string().optional(),
  start: z.number().or(z.string()),
  end: z.number().or(z.string()),
  step: z.number().or(z.string()).optional().default(1),
});

export class ForLoopBlock extends BaseBlock {
  constructor(
    context: Context,
    input: z.infer<typeof forLoopBlockSchema>,
    protected readonly childEngine: Engine,
    next?: string
  ) {
    if (!forLoopBlockSchema.safeParse(input).success) {
      throw new Error("Invalid input for ForLoopBlock");
    }
    super(context, input, next);
  }

  override async executeAsync(
    callback?: (i: number) => void,
    useEngine: boolean = true
  ): Promise<BlockOutput> {
    const { data: input, success } = forLoopBlockSchema.safeParse(this.input);
    if (!success) {
      return {
        continueIfFail: false,
        successful: false,
        next: this.next,
      };
    }
    const step =
      typeof input.step == "string"
        ? this.context.vm.run(
            input.step.startsWith("js:") ? input.step.slice(3) : input.step
          )
        : input.step;
    const start =
      typeof input.start == "string"
        ? this.context.vm.run(
            input.start.startsWith("js:") ? input.start.slice(3) : input.start
          )
        : input.start;
    const end =
      typeof input.end == "string"
        ? this.context.vm.run(
            input.end.startsWith("js:") ? input.end.slice(3) : input.end
          )
        : input.end;
    for (let i = start; i < end; i += step) {
      if (input.block && useEngine)
        await this.childEngine.start(input.block, i);
      callback && callback(i);
    }
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
    };
  }
}
