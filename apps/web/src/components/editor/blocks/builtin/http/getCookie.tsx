import React from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps, Position } from "@xyflow/react";
import { TbCookie } from "react-icons/tb";
import { useMantineTheme } from "@mantine/core";

const GetCookie = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbCookie color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Cookie"
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

export default GetCookie;
