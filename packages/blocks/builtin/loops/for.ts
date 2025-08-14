import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { Engine } from "../../engine";

export const forLoopBlockSchema = z.object({
	block: z.string().optional(),
	start: z.number(),
	end: z.number(),
	step: z.number().optional().default(1),
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
		const input = this.input as z.infer<typeof forLoopBlockSchema>;
		for (let i = input.start; i < input.end; i += input.step) {
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
