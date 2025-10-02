import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BlockEditor from "../components/editor/blockEditor";
import { BlockEditorContext } from "../context/blockEditorContext";
import { type Edge, type Node } from "@xyflow/react";
import { useChangeTrackerStore } from "../store/changeTrackerStore";
import {
  blocksService,
  edgesService,
  routesService,
  type BulkOperationRequest,
} from "../services";
import { Container, CircularProgress, Alert, Typography } from "@mui/material";
// TODO: fix delete edge/block tracking changes and implement change tracker api endpoint
const Editor = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const changeTrackerStore = useChangeTrackerStore();
  const [initialBlocks, setInitialBlocks] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  // Load blocks for the route
  const {
    data: blocksData,
    isLoading: blocksLoading,
    error: blocksError,
  } = useQuery({
    queryKey: ["blocks", routeId],
    queryFn: () => blocksService.getBlocksByRouteId(routeId!),
    enabled: !!routeId,
  });
  // Load blocks for the route
  const {
    data: routeData,
    isLoading: routeLoading,
    error: routeError,
  } = useQuery({
    queryKey: ["routes", routeId],
    queryFn: () => routesService.getRouteById(routeId!),
    enabled: !!routeId,
  });

  // Load edges for the route
  const {
    data: edgesData,
    isLoading: edgesLoading,
    error: edgesError,
  } = useQuery({
    queryKey: ["edges", routeId],
    queryFn: () => edgesService.getEdgesByRouteId(routeId!),
    enabled: !!routeId,
  });

  // Transform server data to React Flow format
  useEffect(() => {
    if (blocksData && edgesData) {
      // Transform blocks to Node format
      const nodes: Node[] = blocksData.map((block) => ({
        id: block.id,
        type: block.type,
        position: block.position || { x: 0, y: 0 },
        data: {
          ...block.data,
          routeId: block.routeId,
        },
      }));

      // Transform edges to Edge format
      const edges: Edge[] = edgesData.map((edge) => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        sourceHandle: edge.fromHandle!,
        targetHandle: edge.toHandle!,
        animated: true,
      }));

      setInitialBlocks(nodes);
      setInitialEdges(edges);
    }
  }, [blocksData, edgesData]);

  async function addNewBlock(value: Node) {
    changeTrackerStore.trackBlock(value.id, "create");
  }

  async function deleteBlock(value: string) {
    // Track the block for deletion
    changeTrackerStore.trackBlock(value, "delete");

    // Also track all connected edges for deletion
    const connectedEdges = initialEdges.filter(
      (edge) => edge.source === value || edge.target === value
    );

    // Track each connected edge for deletion
    connectedEdges.forEach((edge) => {
      changeTrackerStore.trackEdge(edge.id, "delete");
    });
  }

  async function updateBlock(id: string, _: Node) {
    changeTrackerStore.trackBlock(id, "update");
  }

  async function addNewEdge(value: Edge) {
    changeTrackerStore.trackEdge(value.id, "create");
  }

  async function deleteEdge(id: string) {
    changeTrackerStore.trackEdge(id, "delete");
  }

  async function deleteEdges(ids: string[]) {
    changeTrackerStore.trackEdges(ids, "delete");
  }

  async function saveChanges(blocks: Node[], edges: Edge[]) {
    try {
      // Get changed blocks and edges with their actions
      const blockChanges = changeTrackerStore.getBlockChanges();
      const edgeChanges = changeTrackerStore.getEdgeChanges();

      // Transform changes into bulk operation format
      const bulkData: BulkOperationRequest = {
        blocks: blockChanges.map((change) => {
          const block = blocks.find((b) => b.id === change.id);
          return {
            action: change.action,
            content: block
              ? {
                  id: block.id,
                  type: block.type || "default",
                  position: block.position,
                  data: block.data,
                  routeId: routeId!,
                }
              : { id: change.id }, // For delete operations, only ID is needed
          };
        }),
        edges: edgeChanges.map((change) => {
          const edge = edges.find((e) => e.id === change.id);
          return {
            action: change.action,
            content: edge
              ? {
                  id: edge.id,
                  from: edge.source!,
                  to: edge.target!,
                  fromHandle: edge.sourceHandle ?? "",
                  toHandle: edge.targetHandle ?? "",
                }
              : { id: change.id }, // For delete operations, only ID is needed
          };
        }),
      };

      // Execute bulk operation
      await routesService.bulkOperation(routeId!, bulkData);

      // Reset change tracker
      changeTrackerStore.reset();
      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
      throw error;
    }
  }

  if (!routeId) {
    return (
      <Container>
        <Alert severity="error">Route ID is required</Alert>
      </Container>
    );
  }

  if (blocksLoading || edgesLoading || routeLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading editor...</Typography>
      </Container>
    );
  }

  if (blocksError || edgesError || routeError) {
    return (
      <Container>
        <Alert severity="error">
          Failed to load editor data:{" "}
          {(blocksError || edgesError)?.message || "Unknown error"}
        </Alert>
      </Container>
    );
  }

  return (
    <BlockEditorContext
      value={{
        routeData: routeData!,
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
          trackBlockChange: (
            id: string,
            action: "create" | "update" | "delete"
          ) => changeTrackerStore.trackBlock(id, action),
          trackEdgeChange: (
            id: string,
            action: "create" | "update" | "delete"
          ) => changeTrackerStore.trackEdge(id, action),
        },
      }}
    >
      <BlockEditor blocks={initialBlocks} edges={initialEdges} />
    </BlockEditorContext>
  );
};

export default Editor;
