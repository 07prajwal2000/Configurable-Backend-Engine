import { Script } from "vm";

export class JsVM {
	private context: Record<string, any>;

	constructor(context: Record<string, any>) {
		this.context = context;
	}

	run(code: string, extras?: any): any {
		const script = new Script(code);
		this.context["input"] = extras;
		return script.runInNewContext(this.context);
	}
	async runAsync(code: string, extras?: any): Promise<any> {
		return new Promise((resolve) => {
			resolve(this.run(code, extras));
		});
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
