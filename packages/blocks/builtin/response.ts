import z from "zod";
import { BaseBlock, BlockOutput } from "../baseBlock";
import { httpcodes } from "@cbe/lib";

export const responseBlockSchema = z.object({
  httpCode: z.string().refine((x) => httpcodes.some((y) => y.code == x)),
});

export interface ResponseBlockHTTPResult extends BlockOutput {
  output?: {
    httpCode: string;
    headers: Record<string, string>;
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
    let headers: Record<string, string> = {};
    const key = "responseHttpHeaders";
    if (key in this.context.vars) {
      const headersSchema = z.record(z.string(), z.string().or(z.number()));
      const { success } = headersSchema.safeParse(this.context.vars[key]);
      headers = success ? this.context.vars.httpHeaders : {};
    }
    return {
      continueIfFail: true,
      successful: true,
      output: {
        httpCode: data.httpCode,
        headers: headers,
        body: params,
      },
    };
  }
}
