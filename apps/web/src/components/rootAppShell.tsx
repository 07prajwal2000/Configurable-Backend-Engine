"use client";

import { AppShell } from "@mantine/core";
import { usePathname } from "next/navigation";
import React from "react";
import RootSidebar from "./rootSidebar";

const RootAppShell = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const path = usePathname();

  if (path.startsWith("/editor")) return children;

  return (
    <AppShell
      navbar={{
        width: "15%",
        breakpoint: "xs",
      }}
    >
      <AppShell.Navbar>
        <RootSidebar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default RootAppShell;
