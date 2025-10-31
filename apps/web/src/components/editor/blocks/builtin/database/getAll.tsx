import React from "react";
import BaseBlock from "../../base";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { Text } from "@mantine/core";
import BlockHandle from "../../handle";
import { TbDatabaseSearch } from "react-icons/tb";

const GetAll = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={
        <>
          <TbDatabaseSearch size={15} />
          <Text
            style={{
              position: "absolute",
              bottom: "-3px",
              right: "-7px",
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
      blockName="Get All Records"
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

export default GetAll;
