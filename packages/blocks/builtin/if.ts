import { conditionSchema, evaluateOperator, operatorSchema } from "@cbe/lib";
import {
  BaseBlock,
  baseBlockDataSchema,
  BlockOutput,
  Context,
} from "../baseBlock";
import { z } from "zod";

export const ifBlockSchema = z
  .object({
    conditions: z.array(conditionSchema),
  })
  .extend(baseBlockDataSchema.shape);

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
    return evaluateOperator(this.context.vm, lhs, rhs, operator, js);
  }
}
