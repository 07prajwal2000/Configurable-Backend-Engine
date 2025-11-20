import { routesService } from "@/services/routes";
import { useCanvasBlocksStore, useCanvasEdgesStore } from "@/store/canvas";
import { useBlockDataStore } from "@/store/blockDataStore";
import { useEditorChangeTrackerStore } from "@/store/editor";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { TbDeviceFloppy } from "react-icons/tb";

const SaveEditorButton = () => {
  const changeTracker = useEditorChangeTrackerStore();
  const blocks = useCanvasBlocksStore();
  const edges = useCanvasEdgesStore();
  const blockDataStore = useBlockDataStore();
  const disableButton = changeTracker.tracker.size === 0;
  const { id: routeId } = useParams<{ id: string }>();

  useEffect(() => {
    if (changeTracker.tracker.size > 0) {
      document.body.addEventListener("save-editor", onSaveClicked);
    }
    return () => {
      document.body.removeEventListener("save-editor", onSaveClicked);
    };
  }, [changeTracker.tracker, blockDataStore, blocks, edges]);

  async function onSaveClicked() {
    const notificationId = "canvas-save-success";
    try {
      const blocksMap = new Map<string, (typeof blocks)[0]>();
      const edgesMap = new Map<string, (typeof edges)[0]>();
      const blockActionsToPerform: {
        id: string;
        action: "upsert" | "delete";
      }[] = [];
      const edgeActionsToPerform: {
        id: string;
        action: "upsert" | "delete";
      }[] = [];

      blocks.forEach((block) => blocksMap.set(block.id, block));
      edges.forEach((edge) => edgesMap.set(edge.id, edge));

      const blocksToSave: typeof blocks = [];
      const edgesToSave: typeof edges = [];

      changeTracker.tracker.forEach((value, key) => {
        if (value === "block") {
          const exist = blocksMap.has(key);
          blockActionsToPerform.push({
            id: key,
            action: exist ? "upsert" : "delete",
          });
          if (exist) {
            const blockData = blockDataStore[key];
            const block = blocksMap.get(key)!;
            block.data = blockData;
            blocksToSave.push(block);
          }
        } else if (value === "edge") {
          const exist = edgesMap.has(key);
          edgeActionsToPerform.push({
            id: key,
            action: exist ? "upsert" : "delete",
          });
          if (exist) {
            edgesToSave.push(edgesMap.get(key)!);
          }
        }
      });

      notifications.show({
        id: notificationId,
        loading: true,
        message: "Saving...",
        color: "violet",
        withCloseButton: true,
      });

      await routesService.saveCanvasItems(routeId, {
        actionsToPerform: {
          blocks: blockActionsToPerform,
          edges: edgeActionsToPerform,
        },
        changes: {
          blocks: blocksToSave,
          edges: edgesToSave.map((edge) => ({
            id: edge.id,
            fromHandle: edge.sourceHandle,
            toHandle: edge.targetHandle,
            from: edge.source,
            to: edge.target,
          })),
        },
      });

      changeTracker.reset();
      notifications.update({
        id: notificationId,
        loading: false,
        message: "Successfully saved",
        color: "green",
        withCloseButton: true,
      });
    } catch (error: any) {
      notifications.update({
        id: notificationId,
        loading: false,
        withCloseButton: true,
        color: "red",
        message: "Failed to save",
      });
    }
  }

  return (
    <Button
      size="xs"
      disabled={disableButton}
      variant="light"
      onClick={onSaveClicked}
      color="violet"
      leftSection={<TbDeviceFloppy size={18} />}
    >
      Save
    </Button>
  );
};

export default SaveEditorButton;
