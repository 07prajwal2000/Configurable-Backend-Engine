import { Paper, Stack } from "@mui/material";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Panel,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
  type OnSelectionChangeParams,
} from "@xyflow/react";
import { createContext, useCallback, useContext, useState } from "react";
import Entrypoint from "../blocks/entrypoint";
import { useBlockStore } from "../../store/blockStore";
import IfBlock from "../blocks/builtin/ifBlock";
import AddBlockMenu from "./addBlockMenu";
import ForLoopBlock from "../blocks/builtin/forLoopBlock";
import { showToast } from "../toasts";
import TransformerBlock from "../blocks/builtin/transformerBlock";
import { useBlockEditorContext } from "../../context/blockEditorContext";
import ForeachLoopBlock from "../blocks/builtin/foreachLoopBlock";
import SetVarBlock from "../blocks/builtin/setVarBlock";
import JsExecutorBlock from "../blocks/builtin/jsExecutorBlock";
import ResponseBlock from "../blocks/responseBlock";
import { generateBlockID } from "../../services/blocks";
import Topbar from "./topbar";

const nodeTypes: NodeTypes = {
  entrypoint: Entrypoint,
  if: IfBlock,
  forloop: ForLoopBlock,
  foreachloop: ForeachLoopBlock,
  transformer: TransformerBlock,
  setvar: SetVarBlock,
  jsrunner: JsExecutorBlock,
  response: ResponseBlock,
};

export const blocksList: Record<
  string,
  {
    name: string;
    title: string;
    category: string;
    create(x: number, y: number): Node;
  }
> = {
  forloop: {
    name: "forloop",
    title: "For Loop",
    category: "logic",
    create(x: number, y: number): Node {
      return {
        type: "forloop",
        data: {
          end: 10,
          start: 0,
          step: 1,
        },
        id: "",
        position: { x, y },
      };
    },
  },
  foreachloop: {
    name: "foreachloop",
    title: "For Each Loop",
    category: "logic",
    create(x: number, y: number): Node {
      return {
        data: {
          useParam: false,
          values: [],
        },
        type: "foreachloop",
        id: "",
        position: { x, y },
      };
    },
  },
  if: {
    name: "if",
    title: "If Condition",
    category: "logic",
    create(x: number, y: number): Node {
      return {
        type: "if",
        data: {
          conditions: [],
        },
        id: "",
        position: { x, y },
      };
    },
  },
  setvar: {
    name: "setvar",
    title: "Set Var",
    category: "logic",
    create(x: number, y: number): Node {
      return {
        data: {
          type: "setvar",
          key: "",
          value: "",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  transformer: {
    name: "transformer",
    title: "Transformer",
    category: "misc",
    create(x: number, y: number): Node {
      return {
        type: "transformer",
        data: {
          fieldMap: {},
          useJs: false,
        },
        id: "",
        position: { x, y },
      };
    },
  },
  jsrunner: {
    name: "jsrunner",
    title: "JS Runner",
    category: "misc",
    create(x: number, y: number): Node {
      return {
        type: "jsrunner",
        data: {
          value: "",
        },
        id: "",
        position: { x, y },
      };
    },
  },
  response: {
    name: "response",
    title: "Response",
    category: "misc",
    create(x: number, y: number): Node {
      return {
        type: "response",
        data: {},
        id: "",
        position: { x, y },
      };
    },
  },
};

type BlockEditorProps = {
  blocks: Node[];
  edges: Edge[];
};
const BlockDataUpdater = createContext<{
  updateBlockData: (id: string, data: any) => void;
}>({} as any);

export function useBlockDataUpdater() {
  return useContext(BlockDataUpdater);
}

const BlockEditor = (props: BlockEditorProps) => {
  const blockEditorContext = useBlockEditorContext();
  const [nodes, setNodes] = useState(props.blocks);
  const [edges, setEdges] = useState(props.edges);
  const { selectedBlock, setSelectedBlock } = useBlockStore();

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  function onNodeDragStop(node: Node) {
    blockEditorContext.updateBlock(node.id, node);
  }
  const onConnect = useCallback((params: any) => {
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

  async function addNewBlock(type: string, position: { x: number; y: number }) {
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
        }}
      >
        <ReactFlow
          onEdgeDoubleClick={(_, e) => onEdgeDoubleClick(e.id)}
          nodesConnectable
          onNodeDragStop={(_, n) => onNodeDragStop(n)}
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
          <Background />
          <Panel style={{ width: "100%", top: -5 }} position="top-center">
            <Paper
              sx={{
                margin: 1,
                p: 1,
              }}
            >
              <Topbar />
            </Paper>
          </Panel>
          <Panel style={{ bottom: "60px" }} position="bottom-left">
            <Stack direction={"column-reverse"} gap={2}>
              <AddBlockMenu onAddNewBlock={addNewBlock} />
            </Stack>
          </Panel>
        </ReactFlow>
      </BlockDataUpdater.Provider>
    </Paper>
  );
};

export default BlockEditor;
