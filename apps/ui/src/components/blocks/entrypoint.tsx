import { Position, useNodeConnections, type NodeProps } from "@xyflow/react";
import CustomHandle, { connectionExist } from "../handle";
import BaseBlock from "./baseBlock";

const Entrypoint = (props: NodeProps) => {
  const connections = useNodeConnections({ id: props.id });
  const handleId = `${props.id}-entrypoint`;
  const connExist = connectionExist(handleId, "source", connections);
  return (
    <BaseBlock alignCenter title="Entrypoint" {...props}>
      <CustomHandle
        id={handleId}
        type="source"
        isConnectable={!connExist}
        position={Position.Bottom}
      />
    </BaseBlock>
  );
};

export default Entrypoint;
