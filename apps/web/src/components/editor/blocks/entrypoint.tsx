import React from "react";
import { TbWorldCode } from "react-icons/tb";
import BaseBlock from "./base";
import { NodeProps, Position } from "@xyflow/react";
import BlockHandle from "./handle";

const Entrypoint = (props: NodeProps) => {
  const showTooltip = !props.dragging && props.data.label ? true : false;
  return (
    <BaseBlock
      nodeProps={props}
      icon={<TbWorldCode size={25} />}
      topLeftRounded
      topRightRounded
      tooltip={props?.data?.label?.toString() ?? ""}
      showTooltip={showTooltip}
      blockName="Entrypoint"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle type="target" blockId={props.id} position={Position.Top} />
    </BaseBlock>
  );
};

export default Entrypoint;
