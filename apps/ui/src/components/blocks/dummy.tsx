import { Position, useNodeConnections, type NodeProps } from "@xyflow/react";
import CustomHandle, { connectionExist } from "../handle";
import BaseBlock from "./baseBlock";

const Dummy = (props: NodeProps) => {
  const connections = useNodeConnections({ id: props.id });
  const srcHandleId = `${props.id}-src`;
  const targetHandleId = `${props.id}-target`;
  const targetConnectionExist = connectionExist(
    targetHandleId,
    "target",
    connections
  );
  const srcConnectionExist = connectionExist(
    srcHandleId,
    "source",
    connections
  );

  return (
    <BaseBlock title="Dummy" {...props}>
      <CustomHandle
        isConnectable={!targetConnectionExist}
        type="target"
        id={targetHandleId}
        position={Position.Top}
      />
      <CustomHandle
        id={srcHandleId}
        isConnectable={!srcConnectionExist}
        type="source"
        position={Position.Bottom}
      />
    </BaseBlock>
  );
};

export default Dummy;
