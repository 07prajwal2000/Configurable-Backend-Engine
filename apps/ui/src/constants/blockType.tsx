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

export enum BlockTypes {
  entrypoint = "entrypoint",
  if = "if",
  forloop = "forloop",
  foreachloop = "foreachloop",
  transformer = "transformer",
  setvar = "setvar",
  getvar = "getvar",
  consolelog = "consolelog",
  jsrunner = "jsrunner",
  response = "response",
}

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
};
