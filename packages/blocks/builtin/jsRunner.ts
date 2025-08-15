import { BaseBlock, BlockOutput } from "../baseBlock";

export class JsRunnerBlock extends BaseBlock {
	override async executeAsync(params?: any): Promise<BlockOutput> {
		try {
			const result = this.context.vm.runAsync(this.input, params);
			return {
				continueIfFail: true,
				successful: true,
				output: result,
				next: this.next,
			};
		} catch (error) {
			return {
				continueIfFail: false,
				successful: false,
				error: error?.toString(),
				next: this.next,
			};
		}
	}
}
