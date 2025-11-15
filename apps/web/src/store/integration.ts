import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  state: {
    selectedMenu: string;
  };
};

type Actions = {
  actions: {
    setSelectedMenu: (selectedMenu: string) => void;
  };
};

const store = create<State & Actions>()(
  immer((set) => ({
    state: {
      selectedMenu: "Databases",
    },
    actions: {
      setSelectedMenu: (selectedMenu: string) =>
        set((state) => {
          state.state.selectedMenu = selectedMenu;
        }),
    },
  }))
);

export function useIntegrationState() {
  return store((state) => state.state);
}

export function useIntegrationActions() {
  return store((state) => state.actions);
}
