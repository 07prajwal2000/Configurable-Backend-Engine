import { create } from "zustand";

type State = {
  blockData: Record<string, any>;
};

type Actions = {
  updateBlockData: (id: string, data: any) => void;
  deleteBlockData: (id: string) => void;
  clearBlockData: () => void;
  bulkInsert: (blocks: { id: string; data: any }[]) => void;
};

const blockDataStore = create<State & { actions: Actions }>((set, get) => ({
  blockData: {},
  actions: {
    updateBlockData(id, data) {
      set((state) => ({
        blockData: {
          ...state.blockData,
          [id]: { ...state.blockData[id], ...data }
        }
      }));
    },
    deleteBlockData(id) {
      set((state) => {
        const newBlockData = { ...state.blockData };
        delete newBlockData[id];
        return { blockData: newBlockData };
      });
    },
    clearBlockData() {
      set({ blockData: {} });
    },
    bulkInsert(blocks) {
      const newBlockData = blocks.reduce((acc, block) => {
        acc[block.id] = block.data;
        return acc;
      }, {} as Record<string, any>);
      
      set({ blockData: newBlockData });
    },
  },
}));

export const useBlockDataStore = () =>
  blockDataStore((state) => state.blockData);

export const useBlockDataActionsStore = () =>
  blockDataStore((state) => state.actions);
