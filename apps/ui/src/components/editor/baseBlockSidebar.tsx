import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useNodeConnections,
  type Node,
  type NodeConnection,
} from "@xyflow/react";
import type React from "react";
import { MdDelete, MdMoreVert } from "react-icons/md";
import { useState } from "react";
import { useBlocksContext } from "./blockEditor";

type OptionsMenuProps = {
  title: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

type BaseBlockSidebarProps = {
  block: Node;
  children?: React.ReactNode;
  showConnections?: boolean;
  moreOptions?: OptionsMenuProps[];
};

const BaseBlockSidebar = ({
  block,
  children,
  showConnections,
  moreOptions,
}: BaseBlockSidebarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const connections = useNodeConnections({
    id: block.id,
  });
  const [showOptions, setShowOptions] = useState(false);
  const { deleteBlock } = useBlocksContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    toggleOptions();
  };
  const handleClose = (callback?: Function) => {
    setAnchorEl(null);
    callback?.();
    toggleOptions();
  };
  function toggleOptions() {
    setShowOptions(!showOptions);
  }

  function deleteClicked() {
    handleClose();
    deleteBlock(block.id);
  }

  return (
    <Stack gap={1} pr={3}>
      <Stack
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Typography variant="h6">Block Config</Typography>
        <IconButton
          aria-controls={showOptions ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={showOptions ? "true" : undefined}
          id="sidebar-options-btn"
          onClick={handleClick}
        >
          <MdMoreVert />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={showOptions}
          onClose={toggleOptions}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          {moreOptions?.map((option) => (
            <MenuItem sx={{ p: 0 }} onClick={() => handleClose(option.onClick)}>
              <Button
                sx={{ py: 1, px: 2 }}
                fullWidth
                disableRipple
                startIcon={option.icon}
                color="inherit"
                size="small"
              >
                {option.title}
              </Button>
            </MenuItem>
          ))}
          {moreOptions && <Divider />}
          <MenuItem sx={{ p: 0 }} onClick={() => deleteClicked()}>
            <Button
              sx={{ py: 1, px: 2 }}
              fullWidth
              disableRipple
              color="error"
              startIcon={<MdDelete />}
              size="small"
            >
              Delete
            </Button>
          </MenuItem>
        </Menu>
      </Stack>
      <Divider />
      <Stack mt={1} gap={2}>
        <TextField value={block.id} disabled label="Block ID" size="small" />
        <Grid
          container
          gap={1}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid size={6}>
            <TextField
              fullWidth
              value={`X: ${block.position.x.toFixed(
                2
              )}, Y: ${block.position.y.toFixed(2)}`}
              disabled
              label="Position"
              size="small"
            />
          </Grid>
          <Grid size={5}>
            <TextField
              fullWidth
              label={"Type"}
              disabled
              value={block.type}
              size="small"
            />
          </Grid>
        </Grid>
        {children}
        {showConnections && (
          <Box>
            <Typography variant="h6">Connections</Typography>
            <Divider sx={{ mb: 2 }} />
            <ConnectionsListSidebar
              blockId={block.id}
              connections={connections}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export function ConnectionsListSidebar({
  connections,
  blockId,
}: {
  connections: NodeConnection[];
  blockId: string;
}) {
  const inputColor = useTheme().palette.success.main;
  const outputColor = useTheme().palette.primary.main;
  return (
    <Stack spacing={2}>
      {connections.map((connection) => {
        const isOutput = blockId == connection.source;
        return (
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            justifyContent={"space-between"}
            key={connection.edgeId}
          >
            <Box
              borderRadius={"50%"}
              width={15}
              height={15}
              bgcolor={isOutput ? outputColor : inputColor}
            />
            <TextField
              fullWidth
              disabled
              label={isOutput ? "To" : "From"}
              value={isOutput ? connection.target : connection.source}
              size="small"
            />
          </Stack>
        );
      })}
      {connections.length == 0 && (
        <Typography color="textDisabled" fontSize={18} textAlign={"center"}>
          No Connections
        </Typography>
      )}
    </Stack>
  );
}

export default BaseBlockSidebar;
