import { Box } from "@mantine/core";
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import React from "react";
import "@xyflow/react/dist/style.css";
import { blocksList } from "../../blocks/blocksList";
import {
  useEditorActionsStore,
  useEditorChangeTrackerStore,
} from "@/store/editor";
import { BaseBlockType, BlockTypes, EdgeType } from "@/types/block";
import {
  useCanvasActionsStore,
  useCanvasBlocksStore,
  useCanvasEdgesStore,
} from "@/store/canvas";
import CanvasToolboxPanel from "./toolbox/canvasToolboxPanel";
import { generateID } from "@cbe/lib";
import { edgeTypes } from "../../blocks/customEdge";
import { showNotification } from "@mantine/notifications";
import { BlockCanvasContext } from "@/context/blockCanvas";
import BlockSearchDrawer from "./blockSearchDrawer";
import { createBlockData } from "@/lib/blockFactory";
import EditorToolbox from "./editorToolbox";

type Props = {
  readonly?: boolean;
};

const BlockCanvas = (props: Props) => {
  const {
    blocks: { onBlockChange, deleteBlock, addBlock, updateBlockData },
    edges: { onEdgeChange, addEdge, deleteEdge },
  } = useCanvasActionsStore();
  const actions = useEditorActionsStore();
  const blocks = useCanvasBlocksStore();
  const edges = useCanvasEdgesStore();
  const changeTracker = useEditorChangeTrackerStore();
  const { screenToFlowPosition } = useReactFlow();

  // TODO: Need to implement Undo/Redo
  function doAction(type: "undo" | "redo") {
    // NOT IMPLEMENTED YET
  }

  function deleteEdgeWithHistory(id: string) {
    changeTracker.add(id, "edge");
    deleteEdge(id);
  }
  function deleteBlockWithHistory(id: string) {
    changeTracker.add(id, "block");
    deleteBlock(id);
  }
  function addBlockWithHistory(block: BlockTypes) {
    const position = screenToFlowPosition({
      x: document.body.offsetWidth / 2,
      y: document.body.offsetHeight / 2,
    });
    const data = createBlockData(block);
    const id = generateID();
    addBlock({
      data,
      id,
      position,
      type: block,
    });
    changeTracker.add(id, "block");
  }

  function updateBlockDataWithHistory(id: string, data: any) {
    changeTracker.add(id, "block");
    updateBlockData(id, data);
  }

  function onBlockDragStop(block: BaseBlockType) {
    changeTracker.add(block.id, "block");
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

  return (
    <Box w={"100%"} h={"100%"}>
      <BlockCanvasContext.Provider
        value={{
          undo: () => doAction("undo"),
          redo: () => doAction("redo"),
          deleteBlock: deleteBlockWithHistory,
          deleteEdge: deleteEdgeWithHistory,
          addBlock: addBlockWithHistory,
          updateBlockData: updateBlockDataWithHistory,
        }}
      >
        <Box style={{ position: "absolute", zIndex: 10, right: 0 }} p={"lg"}>
          <EditorToolbox />
        </Box>
        <ReactFlow
          onEdgesChange={onEdgeChange}
          onNodesChange={onBlockChange}
          onConnect={(e) => onEdgeConnect(e as any)}
          nodes={blocks}
          edges={edges}
          onNodeDragStart={(_, node) => onBlockDragStop(node as BaseBlockType)}
          snapToGrid
          snapGrid={[5, 5]}
          onlyRenderVisibleElements
          selectNodesOnDrag
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
        <BlockSearchDrawer />
      </BlockCanvasContext.Provider>
    </Box>
  );
};

export default BlockCanvas;
