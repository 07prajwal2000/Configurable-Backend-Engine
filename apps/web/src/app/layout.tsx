import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import RootAppShell from "@/components/rootAppShell";
import QueryProvider from "../query/queryProvider";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Configurable Backend Engine",
  description: "CBE Console",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <QueryProvider>
            <RootAppShell>{children}</RootAppShell>
          </QueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
