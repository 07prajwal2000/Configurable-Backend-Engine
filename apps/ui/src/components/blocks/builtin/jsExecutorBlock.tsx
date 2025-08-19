import { useBlockDataUpdater } from "../../editor/blockEditor";
import { JsEditorButton } from "../../editor/jsDialogEditor";
import CustomHandle from "../../handle";
import BaseBlock from "../baseBlock";
import { Position, type NodeProps } from "@xyflow/react";

interface JsExecutorProps extends NodeProps {}

const JsExecutorBlock = (props: JsExecutorProps) => {
  const { updateBlockData } = useBlockDataUpdater();

  function onSave(value: string) {
    updateBlockData(props.id, {
      value: value,
    });
  }

  return (
    <BaseBlock title="JS Runner" {...props}>
      <CustomHandle
        id={`${props.id}-target`}
        type="target"
        position={Position.Top}
      />
      <CustomHandle
        id={`${props.id}-source`}
        type="source"
        position={Position.Bottom}
      />
      <JsEditorButton
        title="Edit JavaScript"
        buttonSx={{ fontSize: 5, p: "2px" }}
        onSave={onSave}
        defaultValue={props.data?.value as string}
      />
    </BaseBlock>
  );
};

export default JsExecutorBlock;
