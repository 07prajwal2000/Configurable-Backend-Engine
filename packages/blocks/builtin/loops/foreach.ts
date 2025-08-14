import z from "zod";
import { BlockOutput, Context } from "../../baseBlock";
import { Engine } from "../../engine";
import { ForLoopBlock, forLoopBlockSchema } from "./for";

export const forEachLoopBlockSchema = z.object({
	block: z.string().optional(),
	values: z.array(z.any()),
});

export class ForEachLoopBlock extends ForLoopBlock {
	private readonly values: any[] = null!;
	constructor(
		context: Context,
		input: z.infer<typeof forEachLoopBlockSchema>,
		subEngine: Engine,
		next?: string
	) {
		if (!forEachLoopBlockSchema.safeParse(input).success) {
			throw new Error("Invalid input for ForEachLoopBlock");
		}
		super(
			context,
			{
				start: 0,
				end: input.values.length,
				step: 1,
				block: input.block,
			},
			subEngine
		);
		this.values = input.values;
	}

	override async executeAsync(): Promise<BlockOutput> {
		const input = this.input as z.infer<typeof forLoopBlockSchema>;
		if (!input.block) {
			return {
				continueIfFail: true,
				successful: true,
				next: this.next,
			};
		}
		await super.executeAsync(async (i) => {
			await this.childEngine.start(input.block!, {
				index: i,
				value: this.values[i],
			});
		}, false);
		return {
			continueIfFail: true,
			successful: true,
			next: this.next,
		};
	}
}
