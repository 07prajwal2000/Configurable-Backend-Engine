import { z } from "zod";
import { JsVM } from "../vm";

export const operatorSchema = z
  .enum(["eq", "neq", "gt", "gte", "lt", "lte", "js"])
  .describe("The operator to use for comparison");

export const conditionSchema = z.object({
  // if it is prefixed with `js:` then it will use vm which is created for the request's context
  lhs: z.string().or(z.number().or(z.boolean())),
  rhs: z.string().or(z.number().or(z.boolean())),
  operator: operatorSchema,
  js: z.string().optional(),
  chain: z.enum(["and", "or"]).default("and"),
});

export function evaluateOperator(
  vm: JsVM,
  lhs: any,
  rhs: any,
  operator: z.infer<typeof operatorSchema>,
  js?: string
): boolean {
  const isLhsScript = typeof lhs == "string" && lhs.startsWith("js:");
  const isRhsScript = typeof rhs == "string" && rhs.startsWith("js:");

  if (operator == "js" && !!js) {
    const result = vm.run(js.startsWith("js:") ? js.slice(3) : js);
    return vm.truthy(result);
  } else if (isLhsScript || isRhsScript) {
    lhs = isLhsScript ? vm.run(lhs.slice(3)) : lhs;
    rhs = isRhsScript ? vm.run(rhs.slice(3)) : rhs;
    return evaluateOperator(vm, lhs, rhs, operator);
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
