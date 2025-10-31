import {
  Handle,
  Position,
  useConnection,
  useNodeConnections,
} from "@xyflow/react";
import React from "react";

type Props = {
  style?: React.CSSProperties;
  position?: Position;
  blockId: string;
  type: "source" | "target";
  handleVariant?: string;
  color?: string;
};

const BlockHandle = (props: Props) => {
  const handleId = `${props.blockId}-${props.handleVariant ?? props.type}`;
  const isVertical =
    props.position === Position.Top || props.position === Position.Bottom;
  const isTarget = props.type === "target";
  const width = isVertical ? "15px" : "6px";
  const height = isVertical ? "6px" : "15px";
  const connection = useNodeConnections({
    handleId,
    handleType: props.type,
  });

  return (
    <Handle
      id={handleId}
      position={props.position || Position.Right}
      style={{
        ...props.style,
        borderRadius: isTarget ? "0" : "50%",
        width: isTarget ? width : "10px",
        height: isTarget ? height : "10px",
        backgroundColor: props.color || "gray",
      }}
      type={props.type}
      isConnectable={isTarget || connection.length === 0}
    />
  );
};

export default BlockHandle;
