import { Script } from "node:vm";
import { JsVM } from "./vm";

export interface Context {
	vm: JsVM;
}

export class BaseBlock {
	constructor(
		protected readonly context: Context,
		protected readonly input?: any
	) {}
	public async executeAsync(params?: any): Promise<any> {}
}
