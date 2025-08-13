import { BaseBlock, BlockOutput, Context } from "../baseBlock";
import { z } from "zod";

export const operatorSchema = z.enum([
	"eq",
	"neq",
	"gt",
	"gte",
	"lt",
	"lte",
	"js",
]);

export const conditionSchema = z.object({
	// if it is prefixed with `js:` then it will use vm which is created for the request's context
	lhs: z.string().or(z.number().or(z.boolean())),
	rhs: z.string().or(z.number().or(z.boolean())),
	operator: operatorSchema,
	js: z.string().optional(),
	chain: z.enum(["and", "or"]).default("and"),
});

export const ifBlockSchema = z.object({
	conditions: z.array(conditionSchema),
});

export enum OperatorResult {
	TRUE = 1,
	FALSE = 2,
	OR = 3,
}

export class IfBlock extends BaseBlock {
	constructor(
		private readonly onSuccess: string,
		private readonly onError: string,
		context: Context,
		input: z.infer<typeof ifBlockSchema>
	) {
		super(context, input, onSuccess);
	}

	override async executeAsync(): Promise<BlockOutput> {
		if (!ifBlockSchema.safeParse(this.input).success) {
			return {
				error: "Invalid input",
				continueIfFail: false,
				successful: false,
			};
		}
		const { conditions } = this.input as z.infer<typeof ifBlockSchema>;
		const operatorResults: OperatorResult[] = [];
		for (const condition of conditions) {
			const { lhs, rhs, operator, js, chain } = condition;
			const operatorResult = this.evaluateOperator(lhs, rhs, operator, js);
			operatorResults.push(
				operatorResult ? OperatorResult.TRUE : OperatorResult.FALSE
			);
			if (chain == "and") continue;
			operatorResults.push(OperatorResult.OR);
		}
		const result = this.evaluateResult(operatorResults);
		return {
			output: result,
			successful: result,
			continueIfFail: true,
			error: undefined,
			next: result ? this.onSuccess : this.onError,
		};
	}
	public evaluateResult(results: OperatorResult[]) {
		let n = results.length;
		let totalTrues = 0;
		let checkpoint = 0;
		let totalOperators = 0;
		if (results[n - 1] == OperatorResult.OR) n--;
		for (let i = 0; i < n; i++) {
			const result = results[i];
			if (result != OperatorResult.OR) totalOperators++;
			if (result == OperatorResult.TRUE) {
				totalTrues++;
			} else if (result == OperatorResult.OR) {
				if (totalTrues == i - checkpoint) {
					return true;
				}
				checkpoint = i;
				totalTrues = 0;
			}
		}
		return totalTrues == totalOperators - checkpoint;
	}
	public evaluateOperator(
		lhs: any,
		rhs: any,
		operator: z.infer<typeof operatorSchema>,
		js?: string
	): boolean {
		const isLhsScript = typeof lhs == "string" && lhs.startsWith("js:");
		const isRhsScript = typeof rhs == "string" && rhs.startsWith("js:");
		const vm = this.context.vm;

		if (operator == "js" && !!js) {
			const result = vm.run(js);
			return vm.truthy(result);
		} else if (isLhsScript || isRhsScript) {
			lhs = isLhsScript ? vm.run(lhs.slice(3)) : lhs;
			rhs = isRhsScript ? vm.run(rhs.slice(3)) : rhs;
			return this.evaluateOperator(lhs, rhs, operator);
		} else {
			switch (operator) {
				case "eq":
					return lhs == rhs;
				case "neq":
					return lhs != rhs;
				case "gt":
					return lhs > rhs;
				case "gte":
					return lhs >= rhs;
				case "lt":
					return lhs < rhs;
				case "lte":
					return lhs <= rhs;
				default:
					return false;
			}
		}
	}
}
