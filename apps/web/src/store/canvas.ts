import { BaseBlockType, BlockTypes, EdgeType } from "@/types/block";
import {
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import { create } from "zustand";
import dagre from "@dagrejs/dagre";

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
      formatBlocks(): void;
      updateBlockData: (id: string, data: any) => void;
    };
    edges: {
      addEdge: (edge: EdgeType) => void;
      deleteEdge: (id: string) => void;
      onEdgeChange: (changes: Partial<EdgeChange>[]) => void;
    };
    bulkInsert(blocks: BaseBlockType[], edges: EdgeType[]): void;
  };
};

const useCanvasStore = create<State & Actions>((set, get) => ({
  blocks: [],
  edges: [],
  actions: {
    blocks: {
      formatBlocks() {
        const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(
          () => ({})
        );
        dagreGraph.setGraph({ rankdir: "TB", ranksep: 10 });
        get().blocks.forEach((block) => {
          if (block.type === BlockTypes.stickynote) {
            return;
          } else {
            dagreGraph.setNode(block.id, { width: 100, height: 100 });
          }
        });
        get().edges.forEach((edge) => {
          dagreGraph.setEdge(edge.source, edge.target);
        });
        dagre.layout(dagreGraph);
        const blocks = get().blocks.map((block) => {
          if (block.type === BlockTypes.stickynote) {
            return block;
          }
          const node = dagreGraph.node(block.id);
          return { ...block, position: { x: node.x, y: node.y } };
        });
        set({ blocks });
      },
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
      updateBlockData(id, data) {
        set({
          blocks: get().blocks.map((block) =>
            block.id === id
              ? { ...block, data: { ...block.data, ...data } }
              : block
          ),
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
    bulkInsert(blocks, edges) {
      set({ blocks: [...blocks] });
      set({ edges: [...edges] });
    },
  },
}));

export const useCanvasActionsStore = () =>
  useCanvasStore((state) => state.actions);
export const useCanvasBlocksStore = () =>
  useCanvasStore((state) => state.blocks);
export const useCanvasEdgesStore = () => useCanvasStore((state) => state.edges);
