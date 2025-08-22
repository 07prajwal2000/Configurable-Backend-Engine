import BaseBlock from "../../baseBlock";
import CustomHandle, { connectionExist } from "../../../handle";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";

export function GetHttpRequestBodySidebar({ block }: { block: Node }) {
  return <BaseBlockSidebar block={block} showConnections />;
}

const GetHttpRequestBody = (props: NodeProps) => {
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

  return (
    <BaseBlock alignCenter {...props} title="Get HTTP Request Body">
      <CustomHandle
        id={targetHandleId}
        isConnectable={!targetConnExist}
        type="target"
        position={Position.Top}
      />
      <CustomHandle
        id={srcHandleId}
        isConnectable={!srcConnExist}
        type="source"
        position={Position.Bottom}
      />
    </BaseBlock>
  );
};

export default GetHttpRequestBody;
