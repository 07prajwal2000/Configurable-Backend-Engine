import { JsVM } from "@cbe/lib/vm";

export interface Context {
  vm: JsVM;
  route: string;
  apiId: string;
  vars: ContextVarsType & Record<string, any>;
  requestBody?: any;
}

export enum HttpCookieSameSite {
  Empty = "",
  Lax = "Lax",
  Strict = "Strict",
  None = "None",
}

export interface HttpCookieSettings {
  name: string;
  value: string | number;
  domain?: string;
  path?: string;
  expiry?: Date | string;
  httpOnly?: boolean;
  secure?: boolean;
  samesite?: HttpCookieSameSite;
}

export interface ContextVarsType {
  httpRequestQuery: Record<string, string>;
  httpRequestMethod: Record<string, string>;
  httpRequestCookies: Record<string, string>;
  httpRequestHeaders: Record<string, string>;
  httpRequestRoute: Record<string, string>;
  responseHttpHeaders: Record<string, string>;
  responseHttpCookies: Record<string, HttpCookieSettings>;
}

export interface BlockOutput {
  output?: any;
  next?: string;
  error?: string;
  successful: boolean;
  continueIfFail: boolean;
}

export abstract class BaseBlock {
  constructor(
    protected readonly context: Context,
    protected readonly input?: any,
    public readonly next?: string
  ) {}
  public abstract executeAsync(params?: any): Promise<BlockOutput>;
}
