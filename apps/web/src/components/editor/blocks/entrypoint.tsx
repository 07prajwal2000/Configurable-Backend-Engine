import React from "react";
import { TbWorldCode } from "react-icons/tb";
import BaseBlock from "./base";
import { NodeProps, Position } from "@xyflow/react";
import BlockHandle from "./handle";

const Entrypoint = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbWorldCode size={15} />}
      topLeftRounded
      topRightRounded
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={false}
      blockName="Entrypoint"
      labelPlacement="top"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
    </BaseBlock>
  );
};

export default Entrypoint;
