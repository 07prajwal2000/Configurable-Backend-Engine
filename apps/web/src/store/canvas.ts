import { BaseBlockType, BlockTypes, EdgeType } from "@/types/block";
import {
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import { create } from "zustand";

type State = {
  blocks: BaseBlockType[];
  edges: EdgeType[];
};

type Actions = {
  actions: {
    blocks: {
      addBlock: (block: BaseBlockType) => void;
      deleteBlock: (id: string) => void;
      onBlockChange: (changes: NodeChange[]) => void;
      updateBlock: (id: string, block: Partial<BaseBlockType>) => void;
    };
    edges: {
      addEdge: (edge: EdgeType) => void;
      deleteEdge: (id: string) => void;
      onEdgeChange: (changes: Partial<EdgeChange>[]) => void;
    };
  };
};

const useCanvasStore = create<State & Actions>((set, get) => ({
  blocks: [
    {
      id: "weas",
      data: {
        label: "entrypoint",
      },
      position: { x: 0, y: 0 },
      type: BlockTypes.db_native,
    },
    {
      id: "as2wewe",
      data: {},
      position: { x: 80, y: 130 },
      type: BlockTypes.db_transaction,
    },
    {
      id: "as2wewes",
      data: {},
      position: { x: 180, y: 130 },
      type: BlockTypes.db_insert,
    },
  ],
  edges: [],
  actions: {
    blocks: {
      addBlock(block) {
        set({ blocks: [...get().blocks, block] });
      },
      deleteBlock(id) {
        set({ blocks: get().blocks.filter((b) => b.id !== id) });
      },
      updateBlock(id, newBlock) {
        set({
          blocks: get().blocks.map((block) =>
            block.id === id ? { ...block, ...newBlock } : block
          ),
        });
      },
      onBlockChange(changes) {
        set({
          blocks: applyNodeChanges(changes, get().blocks) as BaseBlockType[],
        });
      },
    },
    edges: {
      addEdge(edge) {
        set({ edges: [...get().edges, edge] });
      },
      deleteEdge(id) {
        set({ edges: get().edges.filter((e) => e.id !== id) });
      },
      onEdgeChange(changes) {
        set({ edges: applyEdgeChanges(changes as any, get().edges) });
      },
    },
  },
}));

export const useCanvasActionsStore = () =>
  useCanvasStore((state) => state.actions);
export const useCanvasBlocksStore = () =>
  useCanvasStore((state) => state.blocks);
export const useCanvasEdgesStore = () => useCanvasStore((state) => state.edges);
