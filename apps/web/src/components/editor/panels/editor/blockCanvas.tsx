import { Box } from "@mantine/core";
import { Background, Panel, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import React, { createContext } from "react";
import "@xyflow/react/dist/style.css";
import { blocksList } from "../../blocks/blocksList";
import {
  useEditorActionsStore,
  useEditorChangeTrackerStore,
} from "@/store/editor";
import { BaseBlockType, EdgeType } from "@/types/block";
import {
  useCanvasActionsStore,
  useCanvasBlocksStore,
  useCanvasEdgesStore,
} from "@/store/canvas";
import CanvasToolboxPanel from "./toolbox/canvasToolboxPanel";
import { generateID } from "@cbe/lib";
import { edgeTypes } from "../../blocks/customEdge";

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
    edges: { onEdgeChange, addEdge, deleteEdge },
  } = useCanvasActionsStore();
  const actions = useEditorActionsStore();
  const blocks = useCanvasBlocksStore();
  const edges = useCanvasEdgesStore();
  const changeTracker = useEditorChangeTrackerStore();

  function onBlockDragStop(block: BaseBlockType) {
    changeTracker.add(block.id, "block");
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
          type == "undo" ? deleteBlock(item.id) : addBlock(item);
        } else if (item.actionType === "delete") {
          type == "undo" ? addBlock(item) : deleteBlock(item.id);
        }
        break;
      case "edge":
        if (item.actionType === "add") {
          type == "undo" ? deleteEdge(item.id) : addEdge(item);
        } else if (item.actionType === "delete") {
          type == "undo" ? addEdge(item) : deleteEdge(item.id);
        }
        break;
    }
    if (type === "undo") changeTracker.remove(item.id);
    else changeTracker.add(item.id, item.variant);
  }

  function onEdgeConnect(edge: EdgeType) {
    edge.id = generateID();
    changeTracker.add(edge.id, "edge");
    // @ts-ignore
    edge.type = "custom";
    actions.record(
      JSON.parse(
        JSON.stringify({
          variant: "edge",
          actionType: "add",
          ...edge,
        })
      )
    );
    addEdge(edge);
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
            onConnect={(e) => onEdgeConnect(e as any)}
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
            panOnDrag={[0]}
            edgeTypes={edgeTypes}
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
