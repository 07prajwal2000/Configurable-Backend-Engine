import { JsVM } from "./vm";

export interface Context {
	vm: JsVM;
	route: string;
	apiId: string;
	vars: Record<string, any>;
}

export interface BlockOutput {
	output?: any;
	next?: string;
	error?: string;
	successful: boolean;
	continueIfFail: boolean;
}

export abstract class BaseBlock {
	constructor(
		protected readonly context: Context,
		protected readonly input?: any,
		public readonly next?: string
	) {}
	public abstract executeAsync(params?: any): Promise<BlockOutput>;
}
