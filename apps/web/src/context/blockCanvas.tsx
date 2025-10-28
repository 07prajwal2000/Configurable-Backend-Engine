import { createContext } from "react";

export const BlockCanvasContext = createContext<{
  undo: () => void;
  redo: () => void;
  deleteBlock: (id: string) => void;
  deleteEdge: (id: string) => void;
}>({} as any);
