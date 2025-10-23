import { useEditorSearchbarStore } from "@/store/editor";
import { ActionIcon, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import React, { useState } from "react";
import { TbSearch, TbX } from "react-icons/tb";

const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useEditorSearchbarStore();
  const [searchQueryState, setSearchQueryState] = useState(searchQuery);
  const onSearchDebounced = useDebouncedCallback(setSearchQuery, 300);

  React.useEffect(() => {
    onSearchDebounced(searchQueryState);
  }, [searchQueryState]);

  function resetSearch() {
    setSearchQueryState("");
  }

  return (
    <TextInput
      value={searchQueryState}
      onChange={(e) => setSearchQueryState(e.target.value)}
      placeholder="Search blocks..."
      size="md"
      leftSection={<TbSearch size={16} />}
      rightSection={
        <ActionIcon
          display={searchQueryState ? "block" : "none"}
          variant="transparent"
          color="dark"
          onClick={resetSearch}
        >
          <TbX size={12} />
        </ActionIcon>
      }
    />
  );
};

export default SearchInput;
