import { Position, type NodeProps } from "@xyflow/react";
import CustomHandle from "../handle";
import BaseBlock from "./baseBlock";

const Dummy = (props: NodeProps) => {
  return (
    <BaseBlock showSettings title="Dummy" {...props}>
      <CustomHandle type="target" position={Position.Top} />
      <CustomHandle type="source" position={Position.Bottom} />
    </BaseBlock>
  );
};

export default Dummy;
