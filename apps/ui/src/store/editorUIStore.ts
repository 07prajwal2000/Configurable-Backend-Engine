import { create } from "zustand";

type StoreType = {
  addBlockMenuOpen: boolean;
  setAddBlockMenuOpen: (val: boolean) => void;
};

const store = create<StoreType>((set) => ({
  addBlockMenuOpen: false,
  setAddBlockMenuOpen: (val: boolean) =>
    set((p) => ({ ...p, addBlockMenuOpen: val })),
}));

export function useEditorUIStore() {
  return store();
}
