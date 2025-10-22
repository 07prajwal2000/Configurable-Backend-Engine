import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum EditorTab {
  EDITOR = "editor",
  EXECUTIONS = "settings",
  TESTING = "testing",
}

type State = {
  tabs: {
    activeTab: EditorTab;
  };
  searchbar: {
    opened: boolean;
  };
  aiWindow: {
    opened: boolean;
  };
};

type Actions = {
  tabs: {
    setEditorTab: (tab: EditorTab) => void;
  };
  searchbar: {
    open: () => void;
    close: () => void;
  };
  aiWindow: {
    toggle: () => void;
  };
  reset: () => void;
};

export const useEditorStore = create<State & Actions>()(
  immer((set) => ({
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
      open() {
        set((state) => {
          state.searchbar.opened = true;
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
    reset() {
      set((state) => {
        state.tabs.activeTab = EditorTab.EDITOR;
        state.searchbar.opened = false;
        state.aiWindow.opened = false;
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
