import React from "react";

const Page = async (params: PageProps<"/editor/[id]">) => {
  const { id } = await params.params;
  return <div>Editor opened for {id}</div>;
};

export default Page;
