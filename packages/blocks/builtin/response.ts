import z from "zod";
import {
  BaseBlock,
  baseBlockDataSchema,
  BlockOutput,
  Context,
} from "../baseBlock";
import { httpcodes } from "@fluxify/lib";

export const responseBlockSchema = z
  .object({
    httpCode: z.string().refine((x) => httpcodes.some((y) => y.code == x)),
  })
  .extend(baseBlockDataSchema.shape);

export interface ResponseBlockHTTPResult extends BlockOutput {
  output?: {
    httpCode: string;
    body: unknown;
  };
}

export class ResponseBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<ResponseBlockHTTPResult> {
    const { httpCode } = this.input as z.infer<typeof responseBlockSchema>;
    return {
      continueIfFail: true,
      successful: true,
      output: {
        httpCode,
        body: params ?? null,
      },
    };
  }
}
