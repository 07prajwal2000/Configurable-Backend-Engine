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
  // {
  //   id: generateID(),
  //   data: {
  //     conditions: [],
  //   } as z.infer<typeof ifBlockSchema>,
  //   position: { x: 20, y: -80 },
  //   type: "if",
  // },
  // {
  //   id: generateID(),
  //   position: { x: 20, y: 0 },
  //   data: {
  //     fieldMap: {},
  //     useJs: false,
  //     js: "",
  //   } as z.infer<typeof transformerBlockSchema>,
  //   type: "transformer",
  // },
  // {
  //   id: generateID(),
  //   position: { x: 180, y: -150 },
  //   data: {
  //     start: 0,
  //     end: 10,
  //     step: 1,
  //   } as z.infer<typeof forLoopBlockSchema>,
  //   type: "forloop",
  // },
  // {
  //   id: generateID(),
  //   position: { x: 180, y: -80 },
  //   data: {
  //     values: [],
  //   } as z.infer<typeof forEachLoopBlockSchema>,
  //   type: "foreachloop",
  // },
  // {
  //   id: generateID(),
  //   position: { x: 180, y: 0 },
  //   data: {
  //     key: "",
  //     value: "",
  //   } as z.infer<typeof setVarSchema>,
  //   type: "setvar",
  // },
  // {
  //   id: generateID(),
  //   position: { x: 320, y: -150 },
  //   data: {
  //     value: "",
  //   },
  //   type: "jsrunner",
  // },
  {
    id: generateID(),
    position: { x: 320, y: -80 },
    data: {
      httpCode: 200,
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
