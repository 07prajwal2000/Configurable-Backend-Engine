import { useEditorSearchbarStore } from "@/store/editor";
import { Box } from "@mantine/core";
import React from "react";
import SearchBlockItem from "./searchBlocktem";

const BlockSearchList = () => {
  const { searchQuery } = useEditorSearchbarStore();

  return (
    <Box style={{ height: "100%" }}>
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
      <SearchBlockItem id="1" title="title" description="description" />
    </Box>
  );
};

export default BlockSearchList;
