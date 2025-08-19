import { Box, Grid, Paper } from "@mui/material";
import BlockEditor from "../components/editor/blockEditor";
import EditorSidebar from "../components/editor/editorSidebar";
import { BlockEditorContext } from "../context/blockEditorContext";
import type { Edge, Node } from "@xyflow/react";
import { initialBlocks } from "../store/blockStore";
import { useChangeTrackerStore } from "../store/changeTrackerStore";
import Topbar from "../components/editor/topbar";

const Editor = () => {
  const changeTrackerStore = useChangeTrackerStore();

  async function addNewBlock(value: Node) {
    changeTrackerStore.trackBlock(value.id);
  }
  async function deleteBlock(value: string) {
    changeTrackerStore.trackBlock(value);
  }
  async function updateBlock(id: string, value: Node) {
    changeTrackerStore.trackBlock(id);
  }

  async function addNewEdge(value: Edge) {
    changeTrackerStore.trackEdge(value.id);
  }
  async function deleteEdge(id: string) {
    changeTrackerStore.trackEdge(id);
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
        source: x.source,
        target: x.target,
        sourceHandle: x.sourceHandle,
        targetHandle: x.targetHandle,
      }));
    console.log(changedBlocks);
    console.log(changedEdges);
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
          <BlockEditor blocks={initialBlocks} edges={[]} />
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
    </BlockEditorContext>
  );
};

export default Editor;
