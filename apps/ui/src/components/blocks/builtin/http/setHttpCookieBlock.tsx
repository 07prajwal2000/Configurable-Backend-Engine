import type { setHttpCookieBlockSchema } from "@fluxify/blocks";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type z from "zod";
import CustomHandle, { connectionExist } from "../../../handle";
import BaseBlock from "../../baseBlock";
import { useBlocksContext } from "../../../editor/blockEditor";
import BaseBlockSidebar from "../../../editor/baseBlockSidebar";
import InputWithJs from "../../../inputWithJs";
import { HttpCookieSameSite } from "@fluxify/blocks/baseBlock";

export function SetHttpCookieBlockSidebar({ block }: { block: Node }) {
  const data = block.data as z.infer<typeof setHttpCookieBlockSchema>;
  const { updateBlockData } = useBlocksContext();

  function onNameChange(value: string) {
    updateBlockData(block.id, {
      name: value,
    });
  }
  function onValueChange(value: string) {
    updateBlockData(block.id, {
      value,
    });
  }
  function onDomainChange(value: string) {
    updateBlockData(block.id, {
      domain: value,
    });
  }
  function onPathChange(value: string) {
    updateBlockData(block.id, {
      path: value,
    });
  }
  function onExpiresChange(value: string) {
    updateBlockData(block.id, {
      expires: value,
    });
  }
  function onSameSiteChange(value: string) {
    updateBlockData(block.id, {
      samesite: value,
    });
  }
  function onSecureChange(value: boolean) {
    updateBlockData(block.id, {
      secure: value,
    });
  }
  function onHttpOnlyChange(value: boolean) {
    updateBlockData(block.id, {
      httpOnly: value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <TextField
        label="Cookie Name"
        value={data.name || ""}
        size="small"
        onChange={(e) => onNameChange(e.target.value)}
      />
      <InputWithJs
        label="Cookie Value"
        value={data.value || ""}
        onChange={onValueChange}
        size="small"
      />
      <Stack direction={"column"} gap={1}>
        <Stack direction={"row"} justifyContent={"space-between"} gap={1}>
          <InputWithJs
            label="Domain"
            value={data.domain || ""}
            size="small"
            fullWidth
            onChange={onDomainChange}
          />
          <InputWithJs
            label="Path"
            value={data.path || ""}
            size="small"
            fullWidth
            onChange={onPathChange}
          />
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} gap={1}>
          <InputWithJs
            label="Expires"
            value={data.expiry?.toString() || ""}
            size="small"
            fullWidth
            onChange={onExpiresChange}
          />
          <FormControl fullWidth>
            <InputLabel id="samesite">Same Site</InputLabel>
            <Select
              labelId="samesite"
              id="samesite-input"
              size="small"
              value={data.samesite || ""}
              label="Same Site"
              onChange={(e) => onSameSiteChange(e.target.value)}
            >
              {Object.values(HttpCookieSameSite).map((name) => (
                <MenuItem value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={"row"} gap={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.secure}
                onChange={(_, c) => onSecureChange(c)}
              />
            }
            label="Secure?"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(_, c) => onHttpOnlyChange(c)}
                checked={data.httpOnly}
              />
            }
            label="HTTP Only?"
          />
        </Stack>
      </Stack>
    </BaseBlockSidebar>
  );
}

const SetHttpCookieBlock = (props: NodeProps) => {
  const data = props.data as z.infer<typeof setHttpCookieBlockSchema>;
  const primaryColor = useTheme().palette.primary;
  const connections = useNodeConnections({
    id: props.id,
  });
  const targetHandleId = `${props.id}-target`;
  const targetConnExist = connectionExist(
    targetHandleId,
    "target",
    connections
  );
  const srcHandleId = `${props.id}-source`;
  const srcConnExist = connectionExist(srcHandleId, "source", connections);
  let value = data.value;
  if (value && typeof value == "string" && value.startsWith("js:")) {
    value = "js";
  }

  return (
    <BaseBlock {...props} title="Set Cookie">
      <CustomHandle
        id={targetHandleId}
        isConnectable={!targetConnExist}
        type="target"
        position={Position.Top}
      />
      <CustomHandle
        id={srcHandleId}
        isConnectable={!srcConnExist}
        type="source"
        position={Position.Bottom}
      />

      <Stack direction={"column"} gap={0.5}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Name</Typography>
          </Grid>
          <Grid size={4}>
            <Typography
              fontSize={6}
              sx={{
                textAlign: "center",
                textOverflow: "ellipsis",
                border: 1,
                px: 1,
                borderRadius: 1,
                width: "40px",
                borderColor: primaryColor.main,
              }}
            >
              {data.name || "-"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Value</Typography>
          </Grid>
          <Grid size={4}>
            <Typography
              fontSize={6}
              sx={{
                textAlign: "center",
                textOverflow: "ellipsis",
                border: 1,
                px: 1,
                borderRadius: 1,
                width: "40px",
                borderColor: primaryColor.main,
              }}
            >
              {value || "-"}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </BaseBlock>
  );
};

export default SetHttpCookieBlock;
