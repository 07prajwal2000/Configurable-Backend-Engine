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
import { BlockCanvasContext } from "@/context/blockCanvas";
import { showNotification } from "@mantine/notifications";

type Props = {
  readonly?: boolean;
};

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
  }
  // TODO: Need to implement Undo/Redo
  function doAction(type: "undo" | "redo") {
    // NOT IMPLEMENTED YET
  }
  function onEdgeConnect(edge: EdgeType) {
    if (edge.source === edge.target) {
      showNotification({
        title: "Error",
        message: "Cannot connect to itself",
        color: "red",
      });
      return;
    }
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
  function deleteEdgeWithHistory(id: string) {
    deleteEdge(id);
  }
  function deleteBlockWithHistory(id: string) {
    deleteBlock(id);
  }

  return (
    <Box w={"100%"} h={"100%"}>
      <BlockCanvasContext.Provider
        value={{
          undo: () => doAction("undo"),
          redo: () => doAction("redo"),
          deleteBlock: (id: string) => deleteBlockWithHistory(id),
          deleteEdge: (id: string) => deleteEdgeWithHistory(id),
        }}
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
