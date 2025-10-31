import React from "react";
import { NodeProps } from "@xyflow/react";
import { Box, useMantineTheme } from "@mantine/core";
import { TbDatabaseSearch } from "react-icons/tb";
import { Position } from "@xyflow/react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { Stack } from "@mantine/core";
import { Text } from "@mantine/core";

const GetSingle = (props: NodeProps) => {
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
              right: "-5px",
              fontSize: "8px",
            }}
            fw={500}
            c="dark"
          >
            1
          </Text>
        </>
      }
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Get Single Record"
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

export default GetSingle;
