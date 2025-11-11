import z from "zod";
import {
  baseBlockDataSchema,
  BaseBlock,
  BlockOutput,
  HttpCookieSameSite,
} from "../../baseBlock";

export const setHttpCookieBlockSchema = z
  .object({
    name: z.string(),
    value: z.string().or(z.number()),
    domain: z.string().optional(),
    path: z.string().optional(),
    expiry: z.date().or(z.string()),
    httpOnly: z.boolean().optional(),
    secure: z.boolean().optional(),
    samesite: z.enum(HttpCookieSameSite).optional(),
  })
  .extend(baseBlockDataSchema.shape);

export class SetHttpCookieBlock extends BaseBlock {
  override async executeAsync(params?: any): Promise<BlockOutput> {
    const input = this.input as z.infer<typeof setHttpCookieBlockSchema>;
    let value = input.value;
    if (typeof value == "string" && value.startsWith("js:")) {
      const js = value.slice(3);
      const res = await this.context.vm.runAsync(js);
      value = res;
    }
    if (typeof input.expiry == "string" && input.expiry.startsWith("js:")) {
      const js = input.expiry.slice(3);
      const res = await this.context.vm.runAsync(js);
      input.expiry = res as string;
    }
    if (typeof input.domain == "string" && input.domain.startsWith("js:")) {
      const js = input.domain.slice(3);
      const res = await this.context.vm.runAsync(js);
      input.domain = res as string;
    }
    if (typeof input.path == "string" && input.path.startsWith("js:")) {
      const js = input.path.slice(3);
      const res = await this.context.vm.runAsync(js);
      input.path = res as string;
    }
    if (typeof input.name == "string" && input.name.startsWith("js:")) {
      const js = input.name.slice(3);
      const res = await this.context.vm.runAsync(js);
      input.name = res as string;
    }
    this.context.vars.setCookie(input.name, {
      value: value,
      domain: input.domain,
      path: input.path,
      expiry: input.expiry,
      httpOnly: input.httpOnly,
      secure: input.secure,
      samesite: input.samesite,
    });
    return {
      continueIfFail: true,
      successful: true,
      next: this.next,
      output: params,
    };
  }
}
