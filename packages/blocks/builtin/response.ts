import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";
import { httpcodes } from "@cbe/lib";

export const responseBlockSchema = z.object({
  httpCode: z.string().refine((x) => httpcodes.some((y) => y.code == x)),
});

export interface ResponseBlockHTTPResult extends BlockOutput {
  output?: {
    httpCode: string;
    body: unknown;
  };
}

export class ResponseBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<ResponseBlockHTTPResult> {
    const { data, success } = responseBlockSchema.safeParse(this.input);
    if (!success) {
      return {
        continueIfFail: false,
        successful: false,
        error: "Failed to parse input in Response Block",
      };
    }
    return {
      continueIfFail: true,
      successful: true,
      output: {
        httpCode: data.httpCode,
        body: params,
      },
    };
  }
}
