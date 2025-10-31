import React from "react";
import BaseBlock from "./base";
import BlockHandle from "./handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbDoorExit } from "react-icons/tb";

const Response = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbDoorExit size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      bottomLeftRounded
      bottomRightRounded
      optionsTooltip={["delete", "options"]}
      blockName="Response"
      labelPlacement="bottom"
    >
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export default Response;
