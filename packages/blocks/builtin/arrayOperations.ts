import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";

export const arrayOperationsEnumSchema = z.enum([
  "push",
  "pop",
  "shift",
  "unshift",
]);

export const arrayOperationsBlockSchema = z.object({
  operation: arrayOperationsEnumSchema,
  value: z.any().optional(),
  useParamAsInput: z.boolean().optional(),
  datasource: z.string(),
});

export class ArrayOperationsBlock extends BaseBlock {
  public async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof arrayOperationsBlockSchema>;
    const array = this.context.vars[input.datasource];
    if (!Array.isArray(array)) {
      return {
        continueIfFail: false,
        successful: false,
        error: "datasource is not an array",
      };
    }
    if (input.useParamAsInput) {
      input.value = params;
    }
    if (
      input.value === undefined &&
      input.operation !== "pop" &&
      input.operation !== "shift"
    ) {
      return {
        continueIfFail: false,
        successful: false,
        error: "value is required for array operation block",
      };
    }
    switch (input.operation) {
      case "push":
        const value = input.value;
        array.push(
          typeof value == "string"
            ? value.startsWith("js:")
              ? this.context.vm.run(value.slice(3))
              : value
            : value
        );
        break;
      case "pop":
        array.pop();
        break;
      case "shift":
        array.shift();
        break;
      case "unshift":
        array.unshift(input.value);
        break;
    }

    return {
      continueIfFail: true,
      successful: true,
      output: array,
      next: this.next,
    };
  }
}
