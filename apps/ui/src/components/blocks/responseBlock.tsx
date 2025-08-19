import { Position, type NodeProps } from "@xyflow/react";
import BaseBlock from "./baseBlock";
import CustomHandle from "../handle";

interface ResponseProps extends NodeProps {}

const ResponseBlock = (props: ResponseProps) => {
  return (
    <BaseBlock alignCenter {...props} title="Output Response">
      <CustomHandle
        id={`${props.id}-target`}
        type="target"
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export default ResponseBlock;
