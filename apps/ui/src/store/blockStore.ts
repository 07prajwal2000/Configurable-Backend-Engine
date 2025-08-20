import { generateID } from "@cbe/lib";
import type { Node } from "@xyflow/react";
import { create } from "zustand";

type BlockStoreType = {
  selectedBlock?: string;
  setSelectedBlock: (value: string) => void;
};

export const initialBlocks: Node[] = [
  {
    id: generateID(),
    data: {},
    position: { x: 20, y: -150 },
    type: "entrypoint",
  },
  {
    id: generateID(),
    position: { x: 320, y: -80 },
    data: {
      httpCode: "200",
    },
    type: "response",
  },
];

const blockStore = create<BlockStoreType>((set) => ({
  setSelectedBlock(value) {
    set((p) => ({ ...p, selectedBlock: value }));
  },
}));

export function useBlockStore() {
  return blockStore();
}
