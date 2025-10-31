import React from "react";
import { TbDatabasePlus } from "react-icons/tb";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import BlockHandle from "../../handle";
import { Text } from "@mantine/core";

const InsertBulk = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={
        <>
          <TbDatabasePlus size={15} />
          <Text
            style={{
              position: "absolute",
              bottom: "-3px",
              right: "-5px",
              fontSize: "8px",
            }}
            fw={500}
            c="dark"
          >
            ...
          </Text>
        </>
      }
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Insert Bulk Record"
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

export default InsertBulk;
