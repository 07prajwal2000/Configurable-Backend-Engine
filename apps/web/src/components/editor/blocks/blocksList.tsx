import { BlockTypes } from "@/types/block";
import Entrypoint from "./entrypoint";
import { NodeTypes } from "@xyflow/react";

const blocksList: NodeTypes = {
  [BlockTypes.entrypoint]: Entrypoint,
};

export { blocksList };
