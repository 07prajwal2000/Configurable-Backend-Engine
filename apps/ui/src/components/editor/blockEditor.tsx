import { Box, Grid, Paper, Stack } from "@mui/material";
import {
  addEdge,
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import { createContext, useCallback, useContext } from "react";
import { useBlockStore } from "../../store/blockStore";
import AddBlockMenu from "./addBlockMenu";
import { showToast } from "../toasts";
import { useBlockEditorContext } from "../../context/blockEditorContext";
import { generateBlockID } from "../../services/blocks";
import { blockTypeMap } from "../../constants/blockType";
import { blocksList } from "../../constants/blocksList";
import EditorSidebar from "./editorSidebar";
import Topbar from "./topbar";
import { generateEdgeID } from "../../services/edges";
import type { BlockTypes } from "@cbe/blocks";

type BlockEditorProps = {
  blocks: Node[];
  edges: Edge[];
};
const BlockDataUpdater = createContext<{
  updateBlockData: (id: string, data: any) => void;
  deleteBlock: (id: string) => void;
}>({} as any);

export function useBlocksContext() {
  return useContext(BlockDataUpdater);
}

const BlockEditor = (props: BlockEditorProps) => {
  const blockEditorContext = useBlockEditorContext();
  const [nodes, setNodes, onNodesChange] = useNodesState(props.blocks);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.edges);
  const { selectedBlock, setSelectedBlock } = useBlockStore();

  function onNodeDragStop(node: Node) {
    blockEditorContext.updateBlock(node.id, node);
  }
  const onConnect = useCallback(async (params: any) => {
    if (params.source === params.target) {
      showToast(
        {
          type: "error",
          message: "Cannot connect to self",
        },
        true
      );
      return;
    }
    params.id = await generateEdgeID();
    params["animated"] = true;
    blockEditorContext.addNewEdge(params);
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
  }, []);
  const onEdgeDoubleClick = useCallback((edgeId: string) => {
    setEdges((edgesSnapshot) =>
      edgesSnapshot.filter((edge) => edge.id !== edgeId)
    );
    blockEditorContext.deleteEdge(edgeId);
  }, []);

  function onSelectionChange(e: OnSelectionChangeParams) {
    if (e.nodes.length == 0 && selectedBlock != "") {
      setSelectedBlock("");
    }
  }

  function onNodeDblClick(node: Node) {
    setSelectedBlock(node.id);
  }

  async function addNewBlock(
    type: BlockTypes,
    position: { x: number; y: number }
  ) {
    const newBlock = blocksList[type];
    if (!newBlock) {
      showToast({
        message: `Block: ${type} not found`,
        type: "error",
      });
      return;
    }
    const newNode = newBlock.create(position.x, position.y);
    newNode.id = await generateBlockID();
    setNodes((p) => [...p, newNode]);
    await blockEditorContext.addNewBlock(newNode);
  }

  async function deleteBlock(id: string) {
    setNodes((p) => p.filter((node) => node.id !== id));
    setSelectedBlock("");
    setEdges((prevEdges) => {
      const diffEdges: string[] = [];
      const newEdges: Edge[] = [];
      for (let edge of prevEdges) {
        if (edge.source == id || edge.target == id) {
          diffEdges.push(edge.id);
          continue;
        }
        newEdges.push(edge);
      }
      blockEditorContext.deleteEdge;
      return newEdges;
    });
    await blockEditorContext.deleteBlock(id);
  }
  async function updateBlockData(id: string, data: any) {
    setNodes((p) =>
      p.map((node) => {
        if (node.id === id) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
          blockEditorContext.updateBlock(id, updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }

  return (
    <Paper sx={{ height: "100%" }}>
      <BlockDataUpdater.Provider
        value={{
          updateBlockData,
          deleteBlock,
        }}
      >
        <ReactFlowProvider>
          <Grid
            container
            sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}
          >
            <Grid size={9}>
              <Paper
                sx={{
                  margin: 1,
                  p: 1,
                }}
              >
                <Topbar />
              </Paper>

              <ReactFlow
                onEdgeDoubleClick={(_, e) => onEdgeDoubleClick(e.id)}
                nodesConnectable
                onNodeDragStop={(_, n) => onNodeDragStop(n)}
                nodesDraggable
                nodes={nodes}
                onNodeDoubleClick={(_, node) => onNodeDblClick(node)}
                nodeTypes={blockTypeMap}
                onSelectionChange={onSelectionChange}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <Background />
                <Panel style={{ bottom: "60px" }} position="bottom-left">
                  <Stack direction={"column-reverse"} gap={2}>
                    <AddBlockMenu onAddNewBlock={addNewBlock} />
                  </Stack>
                </Panel>
              </ReactFlow>
            </Grid>
            <Grid size={3}>
              <Paper
                sx={{
                  overflowX: "hidden",
                  overflowY: "auto",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Box
                  sx={{ width: "100%", maxHeight: "92vh", overflowY: "auto" }}
                  p={2}
                >
                  <EditorSidebar />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </ReactFlowProvider>
      </BlockDataUpdater.Provider>
    </Paper>
  );
};

export default BlockEditor;
