import { BaseBlock, BlockOutput, Context } from "../baseBlock";

type InterceptorFunction = (context: Context) => void;

export class InterceptorBlock extends BaseBlock {
	constructor(
		context: Context,
		next?: string,
		private readonly fn?: InterceptorFunction
	) {
		super(context, undefined, next);
	}

	override executeAsync(): Promise<BlockOutput> {
		this.fn && this.fn(this.context);
		return Promise.resolve({
			continueIfFail: true,
			successful: true,
			next: this.next,
		});
	}
}
