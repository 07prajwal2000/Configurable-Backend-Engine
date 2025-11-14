import { FormErrors } from "@mantine/form";
import z from "zod";

export function getZodValidatedErrors(schema: z.ZodType<any>) {
  return (data: any): FormErrors => {
    const { success, error } = schema.safeParse(data);
    if (success) {
      return {};
    }
    return Object.entries(error.flatten().fieldErrors).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.join(". ");
        return acc;
      },
      {} as FormErrors
    );
  };
}
