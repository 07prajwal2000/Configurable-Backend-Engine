import type { NodeTypes } from "@xyflow/react";
import ForeachLoopBlock from "../components/blocks/builtin/foreachLoopBlock";
import GetVarBlock from "../components/blocks/builtin/getVarBlock";
import JsExecutorBlock from "../components/blocks/builtin/jsExecutorBlock";
import ConsoleLogBlock from "../components/blocks/builtin/logging/consoleBlock";
import Entrypoint from "../components/blocks/entrypoint";
import ResponseBlock from "../components/blocks/responseBlock";
import IfBlock from "../components/blocks/builtin/ifBlock";
import ForLoopBlock from "../components/blocks/builtin/forLoopBlock";
import TransformerBlock from "../components/blocks/builtin/transformerBlock";
import SetVarBlock from "../components/blocks/builtin/setVarBlock";
import { BlockTypes } from "@cbe/blocks";
import ArrayOperationsBlock from "../components/blocks/builtin/arrayOperationsBlock";
import GetHttpRequestHeaderBlock from "../components/blocks/builtin/http/getHttpRequestHeaderBlock";
import SetHttpHeaderBlock from "../components/blocks/builtin/http/setHttpHeaderBlock";
import GetHttpCookieBlock from "../components/blocks/builtin/http/getHttpCookieBlock";
import SetHttpCookieBlock from "../components/blocks/builtin/http/setHttpCookieBlock";
import GetHttpParamBlock from "../components/blocks/builtin/http/getHttpParamBlock";
import GetHttpRequestBody from "../components/blocks/builtin/http/getHttpRequestBody";

export const blockTypeMap: NodeTypes = {
  [BlockTypes.entrypoint]: Entrypoint,
  [BlockTypes.if]: IfBlock,
  [BlockTypes.forloop]: ForLoopBlock,
  [BlockTypes.foreachloop]: ForeachLoopBlock,
  [BlockTypes.transformer]: TransformerBlock,
  [BlockTypes.setvar]: SetVarBlock,
  [BlockTypes.getvar]: GetVarBlock,
  [BlockTypes.consolelog]: ConsoleLogBlock,
  [BlockTypes.jsrunner]: JsExecutorBlock,
  [BlockTypes.response]: ResponseBlock,
  [BlockTypes.arrayops]: ArrayOperationsBlock,
  // HTTP
  [BlockTypes.httpGetHeader]: GetHttpRequestHeaderBlock,
  [BlockTypes.httpSetHeader]: SetHttpHeaderBlock,
  [BlockTypes.httpGetCookie]: GetHttpCookieBlock,
  [BlockTypes.httpSetCookie]: SetHttpCookieBlock,
  [BlockTypes.httpGetParam]: GetHttpParamBlock,
  [BlockTypes.httpGetRequestBody]: GetHttpRequestBody,
};
