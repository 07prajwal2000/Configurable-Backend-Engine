import { BaseBlockType, EdgeType, EditorActionStateType } from "@/types/block";
import { enableMapSet, produce } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

enableMapSet();

export enum EditorTab {
  EDITOR = "editor",
  EXECUTIONS = "settings",
  TESTING = "testing",
}

const STACK_SIZE = 20;

type State = {
  tabs: {
    activeTab: EditorTab;
  };
  searchbar: {
    opened: boolean;
    searchQuery: string;
  };
  aiWindow: {
    opened: boolean;
  };
  actions: {
    undoStack: EditorActionStateType[];
    redoStack: EditorActionStateType[];
    disableRecording: boolean;
  };
  changeTracker: {
    tracker: Set<string>;
  };
};

type Actions = {
  tabs: {
    setEditorTab: (tab: EditorTab) => void;
  };
  searchbar: {
    open: () => void;
    close: () => void;
    setSearchQuery: (query: string) => void;
  };
  aiWindow: {
    toggle: () => void;
  };
  reset: () => void;
  actions: {
    record: (action: EditorActionStateType) => void;
    undo: (
      blocks: BaseBlockType[],
      edges: EdgeType[]
    ) => EditorActionStateType | undefined;
    redo: (
      blocks: BaseBlockType[],
      edges: EdgeType[]
    ) => EditorActionStateType | undefined;
    disable: () => void;
    enable: () => void;
    reset: () => void;
  };
  changeTracker: {
    add: (id: string) => void;
    remove: (id: string) => void;
    reset: () => void;
  };
};

export const useEditorStore = create<State & Actions>()(
  immer((set, get) => ({
    tabs: {
      activeTab: EditorTab.EDITOR,
      setEditorTab(tab) {
        set((state) => {
          state.tabs.activeTab = tab;
        });
      },
    },
    searchbar: {
      opened: false,
      searchQuery: "",
      open() {
        set((state) => {
          state.searchbar.opened = true;
        });
      },
      setSearchQuery(query) {
        set((state) => {
          state.searchbar.searchQuery = query;
        });
      },
      close() {
        set((state) => {
          state.searchbar.opened = false;
        });
      },
    },
    aiWindow: {
      opened: false,
      toggle() {
        set((state) => {
          state.aiWindow.opened = !state.aiWindow.opened;
        });
      },
    },
    actions: {
      undoStack: [],
      redoStack: [],
      disableRecording: false,
      record(action) {
        if (get().actions.disableRecording) return;
        set((state) => {
          state.actions = produce(state.actions, (draft) => {
            draft.redoStack = [];
            draft.undoStack.push(action);
          });
        });
      },
      undo(blocks, edges) {
        if (get().actions.disableRecording) return;
        if (get().actions.undoStack.length === 0) return;
        let copiedData: EditorActionStateType | undefined;
        set((state) => {
          state.actions = produce(state.actions, (draft) => {
            const item = draft.undoStack.pop()!;
            copiedData = JSON.parse(JSON.stringify(item));
            const listSelected = item.variant === "block" ? blocks : edges;
            const itemToPush = listSelected.find((i) => i.id === item.id)!;
            if (itemToPush)
              draft.redoStack.push({
                actionType: item.actionType,
                variant: item.variant,
                ...itemToPush,
              } as any);
            if (draft.redoStack.length > STACK_SIZE) {
              draft.redoStack.shift();
            }
          });
        });
        return copiedData;
      },
      redo(blocks, edges) {
        if (get().actions.disableRecording) return;
        if (get().actions.redoStack.length === 0) return;
        let copiedData: EditorActionStateType | undefined;
        set((state) => {
          state.actions = produce(state.actions, (draft) => {
            const item = draft.redoStack.pop()!;
            copiedData = JSON.parse(JSON.stringify(item));
            const listSelected = item.variant === "block" ? blocks : edges;
            const itemToPush = listSelected.find((i) => i.id === item.id)!;
            if (itemToPush) {
              draft.undoStack.push({
                actionType: item.actionType,
                variant: item.variant,
                ...itemToPush,
              } as any);
            }
            if (draft.undoStack.length > STACK_SIZE) {
              draft.undoStack.shift();
            }
          });
        });
        return copiedData;
      },
      enable() {
        set((state) => {
          state.actions.disableRecording = false;
        });
      },
      disable() {
        set((state) => {
          state.actions.disableRecording = true;
        });
      },
      reset() {
        set((state) => {
          state.actions.undoStack = [];
          state.actions.redoStack = [];
        });
      },
    },
    changeTracker: {
      tracker: new Set(),
      add(id) {
        set((state) => {
          state.changeTracker.tracker = produce(
            state.changeTracker.tracker,
            (draft) => {
              draft.add(id);
            }
          );
        });
      },
      remove(id) {
        set((state) => {
          state.changeTracker.tracker = produce(
            state.changeTracker.tracker,
            (draft) => {
              draft.delete(id);
            }
          );
        });
      },
      reset() {
        set((state) => {
          state.changeTracker = produce(state.changeTracker, (draft) => {
            draft.tracker = new Set();
          });
        });
      },
    },
    reset() {
      set((state) => {
        state.tabs.activeTab = EditorTab.EDITOR;
        state.searchbar.opened = false;
        state.aiWindow.opened = false;
        state.searchbar.searchQuery = "";
        state.actions.reset();
        state.changeTracker.reset();
      });
    },
  }))
);

export function useEditorTabStore() {
  return useEditorStore((state) => state.tabs);
}

export function useEditorSearchbarStore() {
  return useEditorStore((state) => state.searchbar);
}

export function useEditorAiWindowStore() {
  return useEditorStore((state) => state.aiWindow);
}

export function useEditorActionsStore() {
  return useEditorStore((state) => state.actions);
}

export function useEditorChangeTrackerStore() {
  return useEditorStore((state) => state.changeTracker);
}
