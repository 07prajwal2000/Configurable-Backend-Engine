import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlockEditor from "../components/editor/blockEditor";
import { BlockEditorContext } from "../context/blockEditorContext";
import { type Edge, type Node } from "@xyflow/react";
import { useChangeTrackerStore } from "../store/changeTrackerStore";
import { blocksService, edgesService } from "../services";
import { Container, CircularProgress, Alert, Typography } from "@mui/material";

const Editor = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const changeTrackerStore = useChangeTrackerStore();
  const queryClient = useQueryClient();
  const [initialBlocks, setInitialBlocks] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  // Load blocks for the route
  const {
    data: blocksData,
    isLoading: blocksLoading,
    error: blocksError,
  } = useQuery({
    queryKey: ["blocks", routeId],
    queryFn: () => blocksService.getAllBlocks(),
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

  // Mutations for saving changes
  const createBlockMutation = useMutation({
    mutationFn: blocksService.createBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks", routeId] });
    },
  });

  const updateBlockMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      blocksService.updateBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks", routeId] });
    },
  });

  const deleteBlockMutation = useMutation({
    mutationFn: blocksService.deleteBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocks", routeId] });
    },
  });

  const createEdgeMutation = useMutation({
    mutationFn: edgesService.createEdge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges", routeId] });
    },
  });

  const updateEdgeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      edgesService.updateEdge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges", routeId] });
    },
  });

  const deleteEdgeMutation = useMutation({
    mutationFn: edgesService.deleteEdge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["edges", routeId] });
    },
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
    try {
      // Get changed blocks
      const changedBlocks = blocks
        .filter((x) => changeTrackerStore.blocks.has(x.id))
        .map((x) => ({
          id: x.id,
          type: x.type,
          position: x.position,
          data: x.data,
          routeId: routeId,
        }));

      // Get changed edges
      const changedEdges = edges
        .filter((x) => changeTrackerStore.edges.has(x.id))
        .map((x) => ({
          id: x.id,
          from: x.source!,
          to: x.target!,
          fromHandle: x.sourceHandle!,
          toHandle: x.targetHandle!,
        }));

      // Separate new, updated, and deleted items
      const existingBlocks = blocksData || [];
      const existingEdges = edgesData || [];

      // Process blocks
      for (const block of changedBlocks) {
        const existingBlock = existingBlocks.find((b) => b.id === block.id);
        if (existingBlock) {
          // Update existing block
          await updateBlockMutation.mutateAsync({
            id: block.id,
            data: {
              type: block.type,
              position: block.position,
              data: block.data,
              updatedAt: new Date().toISOString(),
            },
          });
        } else {
          // Create new block
          await createBlockMutation.mutateAsync({
            type: block.type || "default",
            position: block.position,
            data: block.data,
            routeId: routeId!,
          });
        }
      }

      // Process edges
      for (const edge of changedEdges) {
        const existingEdge = existingEdges.find((e) => e.id === edge.id);
        if (existingEdge) {
          // Update existing edge
          await updateEdgeMutation.mutateAsync({
            id: edge.id,
            data: {
              from: edge.from,
              to: edge.to,
              fromHandle: edge.fromHandle,
              toHandle: edge.toHandle,
            },
          });
        } else {
          // Create new edge
          await createEdgeMutation.mutateAsync({
            from: edge.from,
            to: edge.to,
            fromHandle: edge.fromHandle,
            toHandle: edge.toHandle,
          });
        }
      }

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

  if (blocksLoading || edgesLoading) {
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

  if (blocksError || edgesError) {
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
      <BlockEditor blocks={initialBlocks} edges={initialEdges} />
    </BlockEditorContext>
  );
};

export default Editor;
