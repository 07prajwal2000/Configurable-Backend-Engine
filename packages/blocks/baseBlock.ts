import { DbFactory } from "@cbe/adapters/db";
import { JsVM } from "@cbe/lib/vm";

export interface Context {
  vm: JsVM;
  route: string;
  apiId: string;
  vars: ContextVarsType & Record<string, any>;
  requestBody?: any;
  dbFactory?: DbFactory;
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
  getQueryParam: (key: string) => string;
  getRouteParam: (key: string) => string;
  getHeader: (key: string) => string;
  setHeader: (key: string, value: string) => void;
  getCookie: (key: string) => string;
  setCookie(name: string, value: any): void;
  httpRequestMethod: string;
  httpRequestRoute: string;
  getRequestBody: () => any;
  getConfig(key: string): string;
  dbQuery?: (query: string) => Promise<void>;
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
