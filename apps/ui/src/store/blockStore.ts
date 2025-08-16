import { create } from "zustand";

type BlockStoreType = {
  selectedBlock?: string;
  setSelectedBlock: (value: string) => void;
  infoSelectedBlock?: string;
  setInfoSelectedBlock: (value: string) => void;
};

const blockStore = create<BlockStoreType>((set) => ({
  setSelectedBlock(value) {
    set((p) => ({ ...p, selectedBlock: value }));
  },
  setInfoSelectedBlock(value) {
    set((p) => ({ ...p, infoSelectedBlock: value }));
  },
}));

export function useBlockStore() {
  return blockStore();
}
