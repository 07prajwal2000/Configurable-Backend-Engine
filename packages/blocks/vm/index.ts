import { deepFreeze } from "@cbe/lib";
import { Script } from "vm";

export class JsVM {
	private context: Record<string, any>;

	constructor(context: Record<string, any>) {
		this.context = deepFreeze(context);
	}

	run(code: string): any {
		const script = new Script(code);
		return script.runInNewContext(this.context);
	}
	async runAsync(code: string): Promise<any> {
		const script = new Script(code);
		const result = script.runInNewContext(this.context);
		return await result;
	}
	truthy(value: any) {
		const type = typeof value;
		if (
			type == "bigint" ||
			type == "number" ||
			type == "string" ||
			type == "boolean"
		) {
			return !!value;
		} else if (type == "object" && value != null) {
			return true;
		} else {
			return false;
		}
	}
	falsy(value: any) {
		return !this.truthy(value);
	}
}
