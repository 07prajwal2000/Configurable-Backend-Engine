import { create } from "zustand";

type ChangeTrackerTypes = {
  blocks: Set<string>;
  edges: Set<string>;
  trackBlock(block: string): void;
  trackEdge(edge: string): void;
  trackEdges(edge: string[]): void;
  reset(): void;
};

const changeTracker = create<ChangeTrackerTypes>((set) => ({
  blocks: new Set(),
  edges: new Set(),
  trackBlock: (block: string) =>
    set((state) => ({ blocks: new Set([...state.blocks, block]) })),
  trackEdge: (edge: string) =>
    set((state) => ({ edges: new Set([...state.edges, edge]) })),
  trackEdges: (edges: string[]) =>
    set((state) => ({ edges: new Set([...state.edges, ...edges]) })),
  reset: () => set({ blocks: new Set(), edges: new Set() }),
}));

export function useChangeTrackerStore() {
  return changeTracker();
}
