import { Box } from "@mantine/core";
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { createContext, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { blocksList } from "../../blocks/blocksList";
import {
  useEditorActionsStore,
  useEditorChangeTrackerStore,
} from "@/store/editor";
import { BaseBlockType, BlockTypes } from "@/types/block";
import {
  useCanvasActionsStore,
  useCanvasBlocksStore,
  useCanvasEdgesStore,
} from "@/store/canvas";
import CanvasToolboxPanel from "./toolbox/canvasToolboxPanel";

type Props = {
  readonly?: boolean;
};

export const BlockCanvasContext = createContext<{
  undo: () => void;
  redo: () => void;
}>({} as any);

const BlockCanvas = (props: Props) => {
  const {
    blocks: { onBlockChange, updateBlock, addBlock, deleteBlock },
    edges: { onEdgeChange, updateEdge, addEdge, deleteEdge },
  } = useCanvasActionsStore();
  const actions = useEditorActionsStore();
  const blocks = useCanvasBlocksStore();
  const edges = useCanvasEdgesStore();
  const changeTracker = useEditorChangeTrackerStore();

  function onBlockDragStop(block: BaseBlockType) {
    changeTracker.add(block.id);
    actions.record(
      JSON.parse(
        JSON.stringify({
          variant: "block",
          actionType: "edit",
          ...block,
        })
      )
    );
  }
  function doAction(type: "undo" | "redo") {
    const item =
      type === "undo"
        ? actions.undo(blocks, edges)
        : actions.redo(blocks, edges);
    if (!item) return;
    switch (item.variant) {
      case "block":
        if (item.actionType === "edit") {
          updateBlock(item.id, { position: item.position });
        } else if (item.actionType === "add") {
          deleteBlock(item.id);
        } else if (item.actionType === "delete") {
          addBlock(item);
        }
        break;
      case "edge":
        if (item.actionType === "add") {
          deleteEdge(item.id);
        } else if (item.actionType === "delete") {
          addEdge(item);
        }
        break;
    }
    if (type === "undo") changeTracker.remove(item.id);
    else changeTracker.add(item.id);
  }

  return (
    <Box w={"100%"} h={"100%"}>
      <BlockCanvasContext.Provider
        value={{ undo: () => doAction("undo"), redo: () => doAction("redo") }}
      >
        <ReactFlowProvider>
          <ReactFlow
            onEdgesChange={onEdgeChange}
            onNodesChange={onBlockChange}
            nodes={blocks}
            edges={edges}
            onNodeDragStart={(_, node) =>
              onBlockDragStop(node as BaseBlockType)
            }
            snapToGrid
            snapGrid={[5, 5]}
            onlyRenderVisibleElements
            selectNodesOnDrag
            onSelectionEnd={(e) => console.log("select", e)}
            onNodeDoubleClick={(e) => console.log("dblclick", e)}
            nodeTypes={blocksList}
            nodesDraggable={!props.readonly}
            nodesConnectable={!props.readonly}
            fitView
            zoomOnScroll={false}
            panOnDrag={[1]}
          >
            <Background />
            <Panel position="bottom-left">
              <CanvasToolboxPanel />
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      </BlockCanvasContext.Provider>
    </Box>
  );
};

export default BlockCanvas;
