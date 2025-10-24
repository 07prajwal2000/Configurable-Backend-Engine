import { Handle, Position } from "@xyflow/react";
import React from "react";

type Props = {
  style?: React.CSSProperties;
  position?: Position;
  blockId: string;
  type: "source" | "target";
};

const BlockHandle = (props: Props) => {
  return (
    <Handle
      id={`${props.blockId}-${props.type}`}
      position={props.position || Position.Right}
      style={{
        ...props.style,
        width: "10px",
        height: "10px",
        backgroundColor: "gray",
      }}
      type={props.type}
      isConnectable={true}
    />
  );
};

export default BlockHandle;
