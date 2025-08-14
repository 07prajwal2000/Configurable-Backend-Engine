import z from "zod";
import { BaseBlock, BlockOutput, Context } from "../../baseBlock";
import { logBlockSchema } from ".";

export class ConsoleLoggerBlock extends BaseBlock {
	constructor(context: Context, next?: string) {
		super(context, undefined, next);
	}

	override async executeAsync(
		params: z.infer<typeof logBlockSchema>
	): Promise<BlockOutput> {
		const isObject = typeof params == "object";
		console.log(params);

		if (isObject && !logBlockSchema.safeParse(params).success) {
			return {
				error: "Log block requires 'message' and 'level' parameters",
				continueIfFail: false,
				successful: false,
			};
		}
		const datetime = new Date().toISOString().split("T");
		const date = datetime[0];
		const time = datetime[1].substring(0, datetime[1].lastIndexOf("."));
		const path = this.context.route;
		const level = !isObject ? "info" : params.level;
		const msg = `${level.toUpperCase()}-${path}-${date} ${time}\n${
			typeof params == "string"
				? params
				: params.message.startsWith("js:")
				? this.context.vm.run(params.message.slice(3))
				: params.message
		}`;
		if (level == "info") {
			console.log(msg);
		} else if (level == "error") {
			console.error(msg);
		} else {
			console.warn(msg);
		}
		return {
			continueIfFail: true,
			successful: true,
			next: this.next,
		};
	}
}
