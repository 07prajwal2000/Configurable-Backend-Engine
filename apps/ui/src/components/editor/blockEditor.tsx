import { Paper, Stack } from "@mui/material";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  MiniMap,
  Panel,
  ReactFlow,
  type Node,
  type NodeTypes,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import Dummy from "../blocks/dummy";
import Entrypoint from "../blocks/entrypoint";
import { useBlockStore } from "../../store/blockStore";
import IfBlock from "../blocks/builtin/ifBlock";
import AaddBlockMenu from "./addBlockMenu";

const initialNodes: Node[] = [
  {
    id: "entry",
    data: {},
    position: { x: 100, y: -120 },
    type: "entrypoint",
  },
  {
    id: "dummy",
    data: {},
    position: { x: 100, y: -50 },
    type: "if",
  },
  {
    id: "1",
    position: { x: 50, y: 20 },
    data: { label: "Node 1" },
    type: "dummy",
  },
  {
    id: "2",
    position: { x: 50, y: 80 },
    data: { label: "Node 2" },
    type: "dummy",
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
];

const nodeTypes: NodeTypes = {
  entrypoint: Entrypoint,
  dummy: Dummy,
  if: IfBlock,
};

const BlockEditor = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { selectedBlock, setSelectedBlock } = useBlockStore();

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback((params: any) => {
    params["animated"] = true;
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);
  const onEdgeDoubleClick = useCallback((edgeId: string) => {
    setEdges((edgesSnapshot) =>
      edgesSnapshot.filter((edge) => edge.id !== edgeId)
    );
  }, []);

  function onSelectionChange(e: OnSelectionChangeParams) {
    if (e.nodes.length == 0 && selectedBlock != "") {
      setSelectedBlock("");
    }
  }

  function onNodeDblClick(node: Node) {
    setSelectedBlock(node.id);
  }

  return (
    <Paper sx={{ height: "100%" }}>
      <ReactFlow
        onEdgeDoubleClick={(_, e) => onEdgeDoubleClick(e.id)}
        nodesConnectable
        nodesDraggable
        nodes={nodes}
        onNodeDoubleClick={(_, node) => onNodeDblClick(node)}
        nodeTypes={nodeTypes}
        onSelectionChange={onSelectionChange}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap
          pannable
          style={{
            bottom: 60,
            width: 150,
          }}
        />
        <Background />
        <Panel style={{ bottom: "100px" }} position="bottom-left">
          <Stack direction={"column-reverse"} gap={2}>
            <AaddBlockMenu />
          </Stack>
        </Panel>
      </ReactFlow>
    </Paper>
  );
};

export default BlockEditor;
