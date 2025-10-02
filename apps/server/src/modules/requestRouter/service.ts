import { getCookie, setCookie } from "hono/cookie";
import { HttpRoute, HttpRouteParser } from "@cbe/lib";
import { Context as BlockContext } from "@cbe/blocks";
import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { JsVM } from "@cbe/lib/vm";
import { startBlocksExecution } from "../../loaders/blocksLoader";
import { appConfigCache } from "../../loaders/appconfigLoader";

export type HandleRequestType = {
  data?: any;
  status: ContentfulStatusCode;
};

export async function handleRequest(
  ctx: Context,
  parser: HttpRouteParser
): Promise<HandleRequestType> {
  const pathId = parser.getRouteId(
    ctx.req.path,
    ctx.req.method as HttpRoute["method"]
  );

  if (!pathId) {
    return {
      status: 404,
      data: {
        message: "Route not found",
      },
    };
  }

  let requestBody = await getRequestBody(ctx);
  const vars = setupContextVars(ctx, requestBody, pathId.routeParams);
  const vm = createJsVM(vars);
  const context: BlockContext = {
    apiId: pathId.id,
    route: ctx.req.path,
    requestBody,
    vm,
    vars,
  };
  const executionResult = await startBlocksExecution(pathId.id, context);
  if (executionResult && executionResult.successful) {
    return {
      status: executionResult.output?.httpCode || 200,
      data:
        executionResult.output?.body || executionResult?.output || "NO RESULT",
    };
  }
  return {
    status: 500,
    data: {
      message: executionResult?.error || "Internal server error",
    },
  };
}

function setupContextVars(
  ctx: Context,
  body: any,
  params?: Record<string, string>
): BlockContext["vars"] {
  return {
    getCookie(key) {
      return getCookie(ctx, key) || "";
    },
    getConfig(key) {
      return appConfigCache[key];
    },
    setCookie(name, options) {
      setCookie(ctx, name, options?.value || "", {
        domain: options?.domain,
        path: options?.path,
        expires: options?.expiry as Date,
        httpOnly: options?.httpOnly,
        secure: options?.secure,
        sameSite: options?.samesite,
      });
    },
    getHeader(key) {
      return ctx.req.header(key) || "";
    },
    getQueryParam(key) {
      return ctx.req.query(key) || "";
    },
    getRequestBody() {
      return body;
    },
    getRouteParam(key) {
      return params?.[key] || "";
    },
    httpRequestMethod: ctx.req.method,
    httpRequestRoute: ctx.req.path,
    setHeader(key, value) {
      ctx.header(key, value);
    },
  };
}

function createJsVM(vars: Record<string, any>) {
  const vm = new JsVM(vars);
  return vm;
}

async function getRequestBody(ctx: Context) {
  const method = ctx.req.method;
  if (method == "POST" || method == "PUT") {
    const contentType = ctx.req.header("Content-Type");
    if (contentType === "application/json") {
      return await ctx.req.json();
    }
    if (contentType === "application/x-www-form-urlencoded") {
      return await ctx.req.formData();
    }
    return await ctx.req.text();
  }
  return null;
}
