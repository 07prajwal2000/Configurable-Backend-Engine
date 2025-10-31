import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { useMantineTheme } from "@mantine/core";
import { FaHeading } from "react-icons/fa";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";

const GetHeader = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<FaHeading color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Header"
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

export default GetHeader;
