import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { useMantineTheme } from "@mantine/core";
import { MdDataObject } from "react-icons/md";
import BlockHandle from "../../handle";
import { Position } from "@xyflow/react";

const GetRequestBody = (props: NodeProps) => {
  const greenColor = useMantineTheme().colors.green[8];

  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<MdDataObject color={greenColor} size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Request Body"
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

export default GetRequestBody;
