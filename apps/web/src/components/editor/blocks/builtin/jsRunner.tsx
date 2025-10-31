import React from "react";
import { NodeProps } from "@xyflow/react";
import BaseBlock from "../base";
import BlockHandle from "../handle";
import { Position } from "@xyflow/react";
import { IoLogoJavascript } from "react-icons/io";

const JsRunner = (props: NodeProps) => {
  return (
    <BaseBlock
      blockId={props.id}
      nodeProps={props}
      icon={<IoLogoJavascript size={15} />}
      tooltip={props?.data?.label?.toString() ?? ""}
      showOptionsTooltip={!props.dragging}
      optionsTooltip={["delete", "options"]}
      blockName="JS Runner"
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

export default JsRunner;
