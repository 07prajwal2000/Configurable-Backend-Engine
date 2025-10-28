import { BlockTypes } from "@/types/block";
import Entrypoint from "./entrypoint";
import { NodeTypes } from "@xyflow/react";
import IfCondition from "./builtin/if";

const blocksList: NodeTypes = {
  [BlockTypes.entrypoint]: Entrypoint,
  [BlockTypes.if]: IfCondition,
};

export { blocksList };
