import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type StateType = {
  pagination: {
    page: number;
    perPage: number;
    totalPages: number;
  };
};

type ActionsType = {
  pagination: {
    setPagination: (page: number, perPage: number) => void;
    setPaginationLimit: (totalPages: number) => void;
  };
};

export const useRouterStore = create<StateType & ActionsType>()(
  immer((set) => ({
    pagination: {
      page: 1,
      perPage: 10,
      totalPages: -1,
      setPaginationLimit(totalPages) {
        set((state) => {
          state.pagination.totalPages = totalPages;
        });
      },
      setPagination(page, perPage) {
        if (page < 1) page = 1;
        if (perPage < 5) perPage = 5;
        if (perPage > 50) perPage = 50;

        set((state) => {
          state.pagination.page = page;
          state.pagination.perPage = perPage;
        });
      },
    },
  }))
);

export const useRouterPagination = () =>
  useRouterStore((state) => state.pagination);
