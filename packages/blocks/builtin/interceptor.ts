import { BaseBlock, BlockOutput, Context } from "../baseBlock";

type InterceptorFunction = (context: Context, params?: any) => void;

export class InterceptorBlock extends BaseBlock {
	constructor(
		context: Context,
		next?: string,
		private readonly fn?: InterceptorFunction
	) {
		super(context, undefined, next);
	}

	override executeAsync(params?: any): Promise<BlockOutput> {
		this.fn && this.fn(this.context, params);
		return Promise.resolve({
			continueIfFail: true,
			successful: true,
			next: this.next,
			output: params,
		});
	}
}
