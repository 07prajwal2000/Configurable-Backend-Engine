import React from "react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCodeVariablePlus } from "react-icons/tb";
import { useMantineTheme } from "@mantine/core";

const SetVar = (props: NodeProps) => {
  const theme = useMantineTheme().colors.violet;
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCodeVariablePlus color={theme[8]} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Set Variable"
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

export default SetVar;
