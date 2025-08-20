import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import CustomHandle, { connectionExist } from "../handle";
import BaseBlock from "./baseBlock";
import BaseBlockSidebar from "../editor/baseBlockSidebar";

const Entrypoint = (props: NodeProps) => {
  const connections = useNodeConnections({ id: props.id });
  const handleId = `${props.id}-entrypoint`;
  const connExist = connectionExist(handleId, "source", connections);
  return (
    <BaseBlock alignCenter title="Entrypoint" {...props}>
      <CustomHandle
        id={handleId}
        type="source"
        isConnectable={!connExist}
        position={Position.Bottom}
      />
    </BaseBlock>
  );
};

export function EntrypointBlockSidebar({ block }: { block: Node }) {
  return <BaseBlockSidebar block={block} showConnections />;
}

export default Entrypoint;
