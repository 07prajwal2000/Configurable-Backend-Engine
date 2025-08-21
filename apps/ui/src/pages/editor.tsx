import BlockEditor from "../components/editor/blockEditor";
import { BlockEditorContext } from "../context/blockEditorContext";
import { type Edge, type Node } from "@xyflow/react";
import { initialBlocks } from "../store/blockStore";
import { useChangeTrackerStore } from "../store/changeTrackerStore";

const Editor = () => {
  const changeTrackerStore = useChangeTrackerStore();

  async function addNewBlock(value: Node) {
    changeTrackerStore.trackBlock(value.id);
  }
  async function deleteBlock(value: string) {
    changeTrackerStore.trackBlock(value);
  }
  async function updateBlock(id: string, _: Node) {
    changeTrackerStore.trackBlock(id);
  }

  async function addNewEdge(value: Edge) {
    changeTrackerStore.trackEdge(value.id);
  }
  async function deleteEdge(id: string) {
    changeTrackerStore.trackEdge(id);
  }
  async function deleteEdges(ids: string[]) {
    changeTrackerStore.trackEdges(ids);
  }

  async function saveChanges(blocks: Node[], edges: Edge[]) {
    // CALL API
    console.log("Changes saved");

    const changedBlocks = blocks
      .filter((x) => changeTrackerStore.blocks.has(x.id))
      .map((x) => ({
        id: x.id,
        position: x.position,
        data: x.data,
        type: x.type,
      }));
    const changedEdges = edges
      .filter((x) => changeTrackerStore.edges.has(x.id))
      .map((x) => ({
        id: x.id,
        from: x.source,
        to: x.target,
        toHandle: x.sourceHandle!.slice(x.sourceHandle!.lastIndexOf("-") + 1),
        fromHandle: x.targetHandle!.slice(x.targetHandle!.lastIndexOf("-") + 1),
      }));
    console.log("Changed", {
      blocks: changedBlocks,
      edges: changedEdges,
    });
    changeTrackerStore.reset();
  }

  return (
    <BlockEditorContext
      value={{
        addNewBlock,
        deleteBlock,
        updateBlock,
        addNewEdge,
        deleteEdge,
        deleteEdges,
        changes: {
          blocks: changeTrackerStore.blocks,
          edges: changeTrackerStore.edges,
          saveChanges,
          discardChanges: changeTrackerStore.reset,
          trackBlockChange: changeTrackerStore.trackBlock,
          trackEdgeChange: changeTrackerStore.trackEdge,
        },
      }}
    >
      <BlockEditor blocks={initialBlocks} edges={[]} />
    </BlockEditorContext>
  );
};

export default Editor;
