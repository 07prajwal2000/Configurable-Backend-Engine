"use client";

import { EditorTab, useEditorStore, useEditorTabStore } from "@/store/editor";
import React, { useEffect } from "react";
import EditorPanel from "./panels/editor";
import ExecutionPanel from "./panels/executionPanel";
import TestingPanel from "./panels/testingPanel";

const EditorWindow = () => {
  const resetStore = useEditorStore((state) => state.reset);
  useEffect(() => {
    return resetStore;
  }, []);

  const { activeTab } = useEditorTabStore();
  if (activeTab === EditorTab.EDITOR) return <EditorPanel />;
  else if (activeTab === EditorTab.EXECUTIONS) <ExecutionPanel />;
  return <TestingPanel />;
};

export default EditorWindow;
