import z from "zod";
import { BaseBlock, BlockOutput } from "../../baseBlock";

export const getHttpCookieBlockSchema = z.object({
  name: z.string(),
});

export class GetHttpCookieBlock extends BaseBlock {
  override async executeAsync(): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof getHttpCookieBlockSchema>;
    const cookie = this.context.vars.getCookie(input.name);
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: cookie,
    };
  }
}
