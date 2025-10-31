import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { useMantineTheme } from "@mantine/core";
import { VscSymbolParameter } from "react-icons/vsc";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";

const GetParam = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<VscSymbolParameter color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Param"
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

export default GetParam;
