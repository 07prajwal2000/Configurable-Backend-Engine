import type { Metadata } from "next";
import "@mantine/core/styles.css";

export const metadata: Metadata = {
  title: "Editor | Configurable Backend Engine",
  description: "CBE Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
