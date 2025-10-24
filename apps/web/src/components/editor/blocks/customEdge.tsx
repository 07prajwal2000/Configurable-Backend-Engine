import { useCanvasActionsStore } from "@/store/canvas";
import {
  useEditorActionsStore,
  useEditorChangeTrackerStore,
} from "@/store/editor";
import { ActionIcon, Box } from "@mantine/core";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  EdgeTypes,
  getBezierPath,
} from "@xyflow/react";
import { TbX } from "react-icons/tb";

export const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  source,
  target,
  sourceHandleId,
  targetHandleId,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { edges } = useCanvasActionsStore();
  const { record } = useEditorActionsStore();
  const changeTracker = useEditorChangeTrackerStore();

  function onDeleteClick() {
    edges.deleteEdge(id);
    record({
      variant: "edge",
      actionType: "delete",
      id,
      source,
      target,
      sourceHandle: sourceHandleId!,
      targetHandle: targetHandleId!,
    });
    changeTracker.add(id, "edge");
  }

  return (
    <>
      <BaseEdge id={id} data-jjj path={edgePath} />
      <EdgeLabelRenderer>
        <Box
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <ActionIcon
            onClick={onDeleteClick}
            style={{ visibility: selected ? "visible" : "hidden" }}
            size={12}
            c={"white"}
            color="dark"
          >
            <TbX size={8} />
          </ActionIcon>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}
