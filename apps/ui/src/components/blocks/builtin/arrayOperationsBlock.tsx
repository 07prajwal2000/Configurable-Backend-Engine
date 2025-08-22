import BaseBlock from "../baseBlock";
import {
  Position,
  useNodeConnections,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlockSidebar from "../../editor/baseBlockSidebar";
import type z from "zod";
import {
  arrayOperationsBlockSchema,
  arrayOperationsEnumSchema,
} from "@cbe/blocks";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useBlocksContext } from "../../editor/blockEditor";
import InputWithJs from "../../inputWithJs";
import HelpText from "../../interactions/helpText";

interface ArrayOperationsBlockProps extends NodeProps {}

export function ArrayOperationsBlockSidebar({ block }: { block: Node }) {
  const { updateBlockData } = useBlocksContext();
  const data = block.data as z.infer<typeof arrayOperationsBlockSchema>;

  function onUseParamChanged(value: boolean) {
    updateBlockData(block.id, {
      useParamAsInput: value,
    });
  }

  function onOperationChange(value: string) {
    updateBlockData(block.id, {
      operation: value,
    });
  }

  function onDatasourceChange(value: string) {
    updateBlockData(block.id, {
      datasource: value,
    });
  }
  function onValueChange(value: string) {
    updateBlockData(block.id, {
      value,
    });
  }

  return (
    <BaseBlockSidebar block={block} showConnections>
      <FormGroup>
        <FormControl fullWidth>
          <InputLabel id={"operation-label"}>Operation</InputLabel>
          <Select
            labelId={"operation-label"}
            label={"Operation"}
            size="small"
            value={data.operation}
            onChange={(e) => onOperationChange(e.target.value)}
          >
            {Object.keys(arrayOperationsEnumSchema.enum).map((key) => (
              <MenuItem value={key} key={key}>
                {key.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {data.operation != "pop" && data.operation != "shift" && (
          <FormControlLabel
            label="Use Param as Input?"
            control={
              <Checkbox
                onChange={(_, value) => onUseParamChanged(value)}
                value={data.useParamAsInput}
              />
            }
          />
        )}
      </FormGroup>
      {data.operation != "pop" && data.operation != "shift" && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          <TextField
            label="Datasource"
            size="small"
            fullWidth
            value={data.datasource}
            onChange={(e) => onDatasourceChange(e.target.value)}
          />
          <HelpText>
            The variable to which this operation will be applied.
          </HelpText>
        </Stack>
      )}
      {!data.useParamAsInput &&
        data.operation != "pop" &&
        data.operation != "shift" && (
          <InputWithJs
            size="small"
            label="Value"
            value={data.value}
            onChange={onValueChange}
          />
        )}
    </BaseBlockSidebar>
  );
}

const ArrayOperationsBlock = (props: ArrayOperationsBlockProps) => {
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
  const data = props.data as z.infer<typeof arrayOperationsBlockSchema>;
  const { updateBlockData } = useBlocksContext();
  const primaryColor = useTheme().palette.primary;

  function onUseParamChanged(value: boolean) {
    updateBlockData(props.id, {
      useParamAsInput: value,
    });
  }

  return (
    <BaseBlock title="Array Operation" {...props}>
      <CustomHandle
        id={srcHandleId}
        type={"source"}
        position={Position.Bottom}
        isConnectable={!srcConnExist}
      />
      <CustomHandle
        id={targetHandleId}
        type={"target"}
        position={Position.Top}
        isConnectable={!targetConnExist}
      />
      <Grid
        container
        maxWidth={120}
        direction={"row"}
        gap={0.5}
        justifyContent={"space-betsween"}
        alignItems={"center"}
      >
        <Grid size={6}>
          <Typography fontSize={6}>Operation</Typography>
        </Grid>
        <Grid size={4}>
          <Typography
            fontSize={6}
            sx={{
              textAlign: "center",
              border: 1,
              px: 1,
              borderRadius: 1,
              borderColor: primaryColor.main,
              textOverflow: "ellipsis",
            }}
          >
            {data.operation.toUpperCase()}
          </Typography>
        </Grid>
        {data.operation != "pop" && data.operation != "shift" && (
          <>
            <Grid size={6}>
              <Typography fontSize={6}>Use Param as Input?</Typography>
            </Grid>
            <Grid size={4}>
              <input
                checked={data.useParamAsInput}
                onChange={(e) => onUseParamChanged(e.target.checked)}
                type="checkbox"
                style={{
                  height: "10px",
                  width: "10px",
                }}
              />
            </Grid>
          </>
        )}
        {!data.useParamAsInput &&
          data.operation != "pop" &&
          data.operation != "shift" && (
            <>
              <Grid size={6}>
                <Typography fontSize={6}>Data Source</Typography>
              </Grid>
              <Grid size={4}>
                <Typography
                  fontSize={6}
                  sx={{
                    textAlign: "center",
                    border: 1,
                    px: 1,
                    borderRadius: 1,
                    borderColor: primaryColor.main,
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.datasource.toUpperCase() || "-"}
                </Typography>
              </Grid>
            </>
          )}
      </Grid>
    </BaseBlock>
  );
};

export default ArrayOperationsBlock;
