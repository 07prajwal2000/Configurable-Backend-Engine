import { enableMapSet, produce } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  blockData: Map<string, any>;
};

enableMapSet();

type Actions = {
  updateBlockData: (id: string, data: any) => void;
  deleteBlockData: (id: string) => void;
  clearBlockData: () => void;
};

const blockDataStore = create<State & { actions: Actions }>()(
  immer((set, get) => ({
    blockData: new Map(),
    actions: {
      updateBlockData(id, data) {
        set((state) => {
          produce(state, (draft) => {
            draft.blockData.set(id, data);
          });
        });
      },
      deleteBlockData(id) {
        set((state) => {
          produce(state, (draft) => {
            draft.blockData.delete(id);
          });
        });
      },
      clearBlockData() {
        set((state) => {
          produce(state, (draft) => {
            draft.blockData.clear();
          });
        });
      },
    },
  }))
);
