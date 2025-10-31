import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { useMantineTheme } from "@mantine/core";
import { FaHeading } from "react-icons/fa";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";

const SetHeader = (props: NodeProps) => {
  const violetColor = useMantineTheme().colors.violet[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<FaHeading color={violetColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Set Header"
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

export default SetHeader;
