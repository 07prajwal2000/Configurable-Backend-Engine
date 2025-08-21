import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import BaseBlock from "./baseBlock";
import CustomHandle, { connectionExist } from "../handle";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import BaseBlockSidebar from "../editor/baseBlockSidebar";
import { useBlocksContext } from "../editor/blockEditor";
import { httpcodes } from "@cbe/lib";

interface ResponseProps extends NodeProps {}

const ResponseBlock = (props: ResponseProps) => {
  const connections = useNodeConnections({ id: props.id });
  const handleId = `${props.id}-target`;
  const connExist = connectionExist(handleId, "target", connections);
  const statusCode = props.data.httpCode;
  const primaryColor = useTheme().palette.primary;

  return (
    <BaseBlock alignCenter {...props} title="Output Response">
      <CustomHandle
        isConnectable={!connExist}
        id={handleId}
        type="target"
        position={Position.Top}
      />
      <Grid
        width={"100%"}
        container
        direction={"row"}
        gap={1}
        mt={1}
        alignItems={"center"}
      >
        <Grid size={5}>
          <Typography fontSize={6}>HTTP Code</Typography>
        </Grid>
        <Grid size={4}>
          <Typography
            sx={{
              textAlign: "center",
              border: 1,
              px: 1,
              borderRadius: 1,
              borderColor: primaryColor.main,
            }}
            fontSize={6}
          >
            {statusCode as string}
          </Typography>
        </Grid>
      </Grid>
    </BaseBlock>
  );
};

export function ResponseBlockSidebar({ block }: { block: Node }) {
  const data = block.data as { httpCode: string };
  const { updateBlockData } = useBlocksContext();

  function onChange(value: string) {
    updateBlockData(block.id, { httpCode: value });
  }

  return (
    <BaseBlockSidebar showConnections block={block}>
      <FormControl fullWidth>
        <InputLabel id="httpselect-label">HTTP Code</InputLabel>
        <Select
          labelId="httpselect-label"
          id="httpselect"
          value={data.httpCode}
          label="HTTP Code"
          size="small"
          sx={{ fontSize: 14 }}
          onChange={(e) => onChange(e.target.value)}
        >
          {httpcodes.map((x) => (
            <MenuItem key={x.code} sx={{ fontSize: 12, p: 1 }} value={x.code}>
              {x.name} ({x.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </BaseBlockSidebar>
  );
}

export default ResponseBlock;
