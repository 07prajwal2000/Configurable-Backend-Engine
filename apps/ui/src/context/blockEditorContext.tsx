import type { Edge, Node } from "@xyflow/react";
import { createContext, useContext } from "react";

export type BlockEditorContextType = {
  addNewBlock: (value: Node) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  updateBlock: (id: string, value: Node) => Promise<void>;
  addNewEdge: (value: Edge) => Promise<void>;
  deleteEdge: (id: string) => Promise<void>;
  changes: {
    blocks: Set<string>;
    trackBlockChange: (id: string) => void;
    edges: Set<string>;
    trackEdgeChange: (id: string) => void;
    saveChanges: (blocks: Node[], edges: Edge[]) => Promise<void>;

    discardChanges: () => void;
  };
};

const blockEditorContext = createContext<BlockEditorContextType>({} as any);

export const BlockEditorContext = blockEditorContext.Provider;

export function useBlockEditorContext() {
  const context = useContext(blockEditorContext);
  return context;
}
