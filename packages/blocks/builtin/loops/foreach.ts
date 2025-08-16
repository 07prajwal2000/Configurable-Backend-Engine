import z, { optional } from "zod";
import { BlockOutput, Context } from "../../baseBlock";
import { Engine } from "../../engine";
import { ForLoopBlock, forLoopBlockSchema } from "./for";

const valuesSchema = z.array(z.any());

export const forEachLoopBlockSchema = z.object({
	block: z.string().optional(),
	values: valuesSchema,
	useParam: z.boolean().optional(),
});
// REDESIGN THIS to accept the values from both constructor as well as params

export class ForEachLoopBlock extends ForLoopBlock {
	private readonly values: any[] = null!;
	private readonly foreachInput: z.infer<typeof forEachLoopBlockSchema> = null!;
	constructor(
		context: Context,
		input: z.infer<typeof forEachLoopBlockSchema>,
		subEngine: Engine,
		next?: string
	) {
		const { success, data: foreachInput } =
			forEachLoopBlockSchema.safeParse(input);
		if (!success) {
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
		this.foreachInput = foreachInput;
		this.values = input.values;
	}

	override async executeAsync(params?: any): Promise<BlockOutput> {
		const paramValues = valuesSchema.safeParse(params);
		if (this.foreachInput.useParam && (!params || !paramValues.success)) {
			return {
				continueIfFail: false,
				successful: false,
				next: this.next,
				error: "Invalid params passed for ForEachLoop Block from parent block",
			};
		}
		const input = this.input as z.infer<typeof forLoopBlockSchema>;
		if (!input.block) {
			return {
				continueIfFail: true,
				successful: true,
				next: this.next,
			};
		}
		if (this.foreachInput.useParam && paramValues.success) {
			input.end = params.length;
		}
		const array = this.foreachInput.useParam ? paramValues.data! : this.values;
		await super.executeAsync(async (i) => {
			await this.childEngine.start(input.block!, array[i]);
		}, false);
		return {
			continueIfFail: true,
			successful: true,
			next: this.next,
		};
	}
}
