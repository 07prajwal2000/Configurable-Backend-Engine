import EditorWindow from "@/components/editor/editorWindow";
import React from "react";

const Page = async (params: PageProps<"/editor/[id]">) => {
  return <EditorWindow />;
};

export default Page;
