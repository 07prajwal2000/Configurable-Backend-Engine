import { Position, useNodeConnections, type NodeProps } from "@xyflow/react";
import CustomHandle, { connectionExist } from "../../handle";
import BaseBlock from "../baseBlock";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import ConditionsBuilder, {
  type SavedConditionsType,
} from "../../conditionsBuilder";
import { useState } from "react";

interface IfBlockProps extends NodeProps {
  data: {
    conditions: SavedConditionsType[];
  };
}

const IfBlock = (props: IfBlockProps) => {
  const [conditionsOpened, setConditionsOpened] = useState(false);
  const toggleConditions = () => {
    setConditionsOpened(!conditionsOpened);
  };
  const successHandleId = `${props.id}-success`;
  const failureHandleId = `${props.id}-failure`;
  const targetHandleId = `${props.id}-target`;

  const connections = useNodeConnections({ id: props.id });

  function onConditionSave(value: SavedConditionsType[]) {
    console.log(value);
  }

  return (
    <BaseBlock alignCenter title="If Condition" {...props}>
      <CustomHandle
        isConnectable={!connectionExist(targetHandleId, "target", connections)}
        id={targetHandleId}
        type="target"
        position={Position.Top}
      />
      <Button
        variant="outlined"
        color="info"
        fullWidth
        sx={{ p: "2px", my: "3px" }}
        size="small"
        onClick={toggleConditions}
      >
        <Typography textAlign={"center"} fontSize={5}>
          Edit Conditions
        </Typography>
      </Button>
      <Stack direction={"row"} justifyContent={"space-around"} width={"100%"}>
        <Grid size={6} position={"relative"}>
          <Box>
            <Typography textAlign={"center"} fontSize={6}>
              On Success
            </Typography>
          </Box>
          <CustomHandle
            isConnectable={
              !connectionExist(successHandleId, "source", connections)
            }
            id={successHandleId}
            bottom={-3}
            type="source"
            position={Position.Bottom}
          />
        </Grid>
        <Grid alignItems={"center"} size={6} position={"relative"}>
          <Box>
            <Typography textAlign={"center"} fontSize={6}>
              On Failure
            </Typography>
          </Box>
          <CustomHandle
            id={failureHandleId}
            isConnectable={
              !connectionExist(failureHandleId, "source", connections)
            }
            bottom={-3}
            type="source"
            position={Position.Bottom}
          />
        </Grid>
      </Stack>
      <ConditionsBuilder
        onSave={onConditionSave}
        opened={conditionsOpened}
        onClose={toggleConditions}
      />
    </BaseBlock>
  );
};

export default IfBlock;
