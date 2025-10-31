import React from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbMatrix } from "react-icons/tb";

const ArrayOperations = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbMatrix size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Array Operations"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export default ArrayOperations;
