import React from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { TbDatabaseX } from "react-icons/tb";

const Delete = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbDatabaseX size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Delete Record(s)"
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

export default Delete;
