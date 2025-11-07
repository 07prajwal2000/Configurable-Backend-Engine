import { ActionIcon, Box, Grid, Modal } from "@mantine/core";
import React from "react";
import { useEditorBlockSettingsStore } from "@/store/editor";
import { useNodesData } from "@xyflow/react";
import BlockDataSettingsPanel from "./blockDataSettingsPanel";
import HelpPanel from "./helpPanel";
import { TbChevronsLeft, TbChevronsRight } from "react-icons/tb";
import { stickyNotesSchema } from "@cbe/blocks";
import z from "zod";

export type DataSettingsProps<T> = {
  blockId: string;
  blockData: T;
};

const BlockSettingsDialog = () => {
  const blockSettings = useEditorBlockSettingsStore();
  const nodesData = useNodesData(blockSettings.blockId);
  const [collapsed, setCollapsed] = React.useState(false);

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  return (
    <Modal
      size="70%"
      withCloseButton={false}
      opened={blockSettings.opened}
      onClose={() => blockSettings.close()}
    >
      <Box h={"80vh"}>
        {nodesData && (
          <Grid h={"80vh"}>
            <Grid.Col
              h={"80vh"}
              style={{ overflowY: "auto" }}
              span={collapsed ? 1 : 3}
              pos="relative"
            >
              <HelpPanel blockData={nodesData} collapsed={collapsed} />
              <ActionIcon
                size={"md"}
                pos={"absolute"}
                variant="outline"
                color="violet"
                right={collapsed ? "50%" : "0"}
                top={"0"}
                style={{
                  transform: ` ${
                    collapsed ? "translateX(50%)" : "translateX(0)"
                  }`,
                }}
                onClick={toggleCollapsed}
              >
                {collapsed ? <TbChevronsRight /> : <TbChevronsLeft />}
              </ActionIcon>
            </Grid.Col>
            <Grid.Col
              h={"80vh"}
              style={{ overflowY: "auto" }}
              span={collapsed ? 11 : 9}
            >
              <BlockDataSettingsPanel blockData={nodesData as any} />
            </Grid.Col>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default BlockSettingsDialog;
