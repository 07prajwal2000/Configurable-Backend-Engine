import { Position, type NodeProps } from "@xyflow/react";
import CustomHandle from "../handle";
import BaseBlock from "./baseBlock";

const Entrypoint = (props: NodeProps) => {
  return (
    <BaseBlock alignCenter title="Entrypoint" {...props}>
      <CustomHandle type="source" position={Position.Bottom} />
    </BaseBlock>
  );
};

export default Entrypoint;
