import React from "react";
import BaseBlock from "../../base";
import BlockHandle from "../../handle";
import { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { TbDatabaseImport } from "react-icons/tb";

const Update = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<TbDatabaseImport size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="Update Record(s)"
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

export default Update;
