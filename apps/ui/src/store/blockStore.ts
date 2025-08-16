import { create } from "zustand";

type BlockStoreType = {
  selectedBlock?: string;
  setSelectedBlock: (value: string) => void;
};

const blockStore = create<BlockStoreType>((set) => ({
  setSelectedBlock(value) {
    set((p) => ({ ...p, selectedBlock: value }));
  },
}));

export function useBlockStore() {
  return blockStore();
}
