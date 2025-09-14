import { create } from "zustand";

type ChangeAction = "create" | "update" | "delete";

type ChangeRecord = {
  id: string;
  action: ChangeAction;
};

type ChangeTrackerTypes = {
  blocks: Map<string, ChangeAction>;
  edges: Map<string, ChangeAction>;
  trackBlock(id: string, action: ChangeAction): void;
  trackEdge(id: string, action: ChangeAction): void;
  trackBlocks(ids: string[], action: ChangeAction): void;
  trackEdges(ids: string[], action: ChangeAction): void;
  getBlockChanges(): ChangeRecord[];
  getEdgeChanges(): ChangeRecord[];
  reset(): void;
};

const changeTracker = create<ChangeTrackerTypes>((set, get) => ({
  blocks: new Map(),
  edges: new Map(),

  trackBlock: (id: string, action: ChangeAction) =>
    set((state) => {
      const newBlocks = new Map(state.blocks);
      newBlocks.set(id, action);
      return { blocks: newBlocks };
    }),

  trackEdge: (id: string, action: ChangeAction) =>
    set((state) => {
      const newEdges = new Map(state.edges);
      newEdges.set(id, action);
      return { edges: newEdges };
    }),

  trackBlocks: (ids: string[], action: ChangeAction) =>
    set((state) => {
      const newBlocks = new Map(state.blocks);
      ids.forEach((id) => newBlocks.set(id, action));
      return { blocks: newBlocks };
    }),

  trackEdges: (ids: string[], action: ChangeAction) =>
    set((state) => {
      const newEdges = new Map(state.edges);
      ids.forEach((id) => newEdges.set(id, action));
      return { edges: newEdges };
    }),

  getBlockChanges: () => {
    const { blocks } = get();
    return Array.from(blocks.entries()).map(([id, action]) => ({
      id,
      action,
    }));
  },

  getEdgeChanges: () => {
    const { edges } = get();
    return Array.from(edges.entries()).map(([id, action]) => ({
      id,
      action,
    }));
  },

  reset: () => set({ blocks: new Map(), edges: new Map() }),
}));

export function useChangeTrackerStore() {
  return changeTracker();
}
