import { EditorTab, useEditorTabStore } from "@/store/editor";
import { Tabs, useMantineTheme } from "@mantine/core";
import React from "react";

const EditorTopbarTabs = () => {
  const { activeTab, setEditorTab } = useEditorTabStore();
  const violet = useMantineTheme().colors.violet;
  return (
    <Tabs
      bg={violet[0]}
      bd={"2px solid violet"}
      w={"fit-content"}
      p={2}
      bdrs={"sm"}
      variant="pills"
      color="violet"
      value={activeTab}
      onChange={(value) => setEditorTab(value as EditorTab)}
    >
      <Tabs.List>
        <Tabs.Tab value={EditorTab.EDITOR}>Editor</Tabs.Tab>
        <Tabs.Tab value={EditorTab.EXECUTIONS}>Executions</Tabs.Tab>
        <Tabs.Tab value={EditorTab.TESTING}>Testing</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default EditorTopbarTabs;
