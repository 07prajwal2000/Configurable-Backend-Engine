import BaseBlockSidebar from "../../editor/baseBlockSidebar";
import { useBlocksContext } from "../../editor/blockEditor";
import { JsEditorButton } from "../../editor/jsDialogEditor";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlock from "../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";

interface JsExecutorProps extends NodeProps {}

export function JsExecutorSidebar({ block }: { block: Node }) {
  const { updateBlockData } = useBlocksContext();
  function onSave(value: string) {
    updateBlockData(block.id, {
      value: value,
    });
  }
  return (
    <BaseBlockSidebar block={block} showConnections>
      <JsEditorButton
        title="Edit JavaScript"
        onSave={onSave}
        defaultValue={block.data?.value as string}
      />
    </BaseBlockSidebar>
  );
}

const JsExecutorBlock = (props: JsExecutorProps) => {
  const { updateBlockData } = useBlocksContext();
  const connections = useNodeConnections({
    id: props.id,
  });
  const targetHandleId = `${props.id}-target`;
  const targetConnExist = connectionExist(
    targetHandleId,
    "target",
    connections
  );
  const srcHandleId = `${props.id}-source`;
  const srcConnExist = connectionExist(srcHandleId, "source", connections);

  function onSave(value: string) {
    updateBlockData(props.id, {
      value: value,
    });
  }

  return (
    <BaseBlock title="JS Runner" {...props}>
      <CustomHandle
        isConnectable={!targetConnExist}
        id={targetHandleId}
        type="target"
        position={Position.Top}
      />
      <CustomHandle
        isConnectable={!srcConnExist}
        id={srcHandleId}
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
