import { BlockTypes } from "@/types/block";
import { createContext } from "react";

export const BlockCanvasContext = createContext<{
  undo: () => void;
  redo: () => void;
  deleteBlock: (id: string) => void;
  deleteEdge: (id: string) => void;
  addBlock: (block: BlockTypes) => void;
}>({} as any);
