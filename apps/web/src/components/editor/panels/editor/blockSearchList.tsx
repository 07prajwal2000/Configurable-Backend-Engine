import { useEditorSearchbarStore } from "@/store/editor";
import { Box } from "@mantine/core";
import React, { useEffect, useMemo } from "react";
import SearchBlockItem from "./searchBlocktem";
import blocksForSearch, { categoryList } from "../../blocks/searchList";

const BlockSearchList = () => {
  const {
    searchQuery,
    setSearchQuery,
    close,
    incrementIndex,
    decrementIndex,
    setCurrentIndex,
    currentIndex,
  } = useEditorSearchbarStore();
  const inCategoryMode = searchQuery?.trim().length === 0;

  const filteredBlocks = useMemo(() => {
    return blocksForSearch.filter((block) => {
      if (searchQuery.startsWith("cat:")) {
        return block.category === searchQuery.slice(4);
      }
      return (
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.tags.filter((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ).length > 0
      );
    });
  }, [searchQuery]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [searchQuery, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [searchQuery]);

  function handleKeyDownEvent(ev: KeyboardEvent) {
    if (ev.key === "Escape") close();
    let incrementor = 0;
    if (ev.key === "ArrowUp") {
      incrementor = -1;
    } else if (ev.key === "ArrowDown") {
      incrementor = 1;
    } else if (ev.key === "Enter") {
      if (inCategoryMode) {
        setSearchQuery(`cat:${categoryList[currentIndex].category}`);
      } else {
        // TODO: Add block to editor
      }
    }
    if (incrementor !== 0) {
      const max = inCategoryMode ? categoryList.length : filteredBlocks.length;
      let newIndex = currentIndex + incrementor;
      if (newIndex < 0) newIndex = max - 1;
      if (newIndex >= max) newIndex = 0;
      setCurrentIndex(newIndex);
    }
  }

  return (
    <Box style={{ height: "100%" }}>
      <Box
        style={{
          height: "100%",
          display: inCategoryMode ? "block" : "none",
        }}
      >
        {categoryList.map((category, i) => (
          <SearchBlockItem
            active={currentIndex === i}
            key={category.id}
            id={category.id}
            itemType={"category"}
            category={category.category}
            title={category.category}
            description={category.description}
            icon={category.icon}
            showRightArrow
            onClick={(e) => setSearchQuery(`cat:${e.value}`)}
          />
        ))}
      </Box>
      {!inCategoryMode &&
        filteredBlocks.map((block, i) => (
          <SearchBlockItem
            active={currentIndex === i}
            key={block.id}
            id={block.id}
            itemType={"block"}
            blockType={block.type}
            title={block.title}
            description={block.description}
            icon={block.icon}
          />
        ))}
    </Box>
  );
};

export default BlockSearchList;
