import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import BlockHandle from "../../handle";
import { TbDatabasePlus } from "react-icons/tb";

const Insert = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbDatabasePlus size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Insert New Record"
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

export default Insert;
