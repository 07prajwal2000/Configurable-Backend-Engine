import { BlockCanvasContext } from "@/context/blockCanvas";
import { useCanvasActionsStore } from "@/store/canvas";
import {
  useEditorBlockSettingsStore,
  useEditorSearchbarStore,
} from "@/store/editor";
import { Edge, Node, useOnSelectionChange, useReactFlow } from "@xyflow/react";
import React, { useCallback, useContext, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const CanvasKeyboardAccessibility = () => {
  const [selectedBlocks, setSelectedBlock] = useState<string[]>([]);
  // selected edges
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const { open: openSearchbar } = useEditorSearchbarStore();
  const { open } = useEditorBlockSettingsStore();
  const { deleteBulk, undo, redo } = useContext(BlockCanvasContext);
  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedBlock(nodes.map((node) => node.id));
      setSelectedEdges(edges.map((edge) => edge.id));
    },
    []
  );

  useOnSelectionChange({
    onChange,
  });
  useHotkeys("enter", onEnterClicked); // select block
  useHotkeys("shift+a", openSearchbar); // open searchbar
  useHotkeys("ctrl+z", undo); // undo
  useHotkeys("ctrl+y, ctrl+shift+z", redo); // redo
  useHotkeys("delete, backspace", onDeleteClicked); // delete
  useHotkeys("ctrl+s", (e) => onSaveClicked(e)); // save

  function onSaveClicked(e: KeyboardEvent) {
    e.preventDefault();
    document.body.dispatchEvent(new CustomEvent("save-editor"));
  }

  function onEnterClicked() {
    if (selectedBlocks.length !== 1) {
      return;
    }
    open(selectedBlocks[0]);
  }

  function onDeleteClicked(e: KeyboardEvent) {
    if (selectedBlocks.length === 0 && selectedEdges.length === 0) {
      return;
    }

    deleteBulk(selectedBlocks, "block");
    deleteBulk(selectedEdges, "edge");
  }

  return <></>;
};

export default CanvasKeyboardAccessibility;
