import React from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbInfinity } from "react-icons/tb";
import { useMantineTheme } from "@mantine/core";

const Forloop = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbInfinity color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="For"
      labelPlacement="left"
    >
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Bottom}
      />
      <BlockHandle
        type="source"
        blockId={`${props.id}`}
        position={Position.Right}
        handleVariant="executor"
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export default Forloop;
