import React from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { LuDatabaseZap } from "react-icons/lu";
import { useMantineTheme } from "@mantine/core";

const Transaction = (props: NodeProps) => {
  const green = useMantineTheme().colors.green;
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<LuDatabaseZap size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Database Transaction"
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
        color={green[8]}
      />
      <BlockHandle
        type="target"
        blockId={`${props.id}`}
        position={Position.Top}
      />
    </BaseBlock>
  );
};

export default Transaction;
