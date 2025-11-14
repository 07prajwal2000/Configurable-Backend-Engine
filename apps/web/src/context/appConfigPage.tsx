"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AppConfigContextType = {
  sort: "asc" | "desc";
  setSort: (sort: "asc" | "desc") => void;
  search: string;
  setSearch: (search: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  selectedItems: Set<string>;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
};

const AppConfigContext = createContext({} as AppConfigContextType);

export function useAppConfig() {
  return useContext(AppConfigContext);
}

interface AppConfigProviderProps {
  children: ReactNode;
}

export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("keyName");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set<string>());

  const selectItem = (id: string) => {
    setSelectedItems((prev) => new Set(prev).add(id));
  };

  const deselectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const value: AppConfigContextType = {
    sort,
    setSort,
    search,
    setSearch,
    sortBy,
    setSortBy,
    page,
    setPage,
    perPage,
    setPerPage,
    totalPages,
    setTotalPages,
    selectedItems,
    selectItem,
    deselectItem,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}
