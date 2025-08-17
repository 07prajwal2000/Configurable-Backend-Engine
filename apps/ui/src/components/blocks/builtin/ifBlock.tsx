import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import CustomHandle from "../../handle";
import BaseBlock from "../baseBlock";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import ConditionsBuilder from "../../conditionsBuilder";
import { useState } from "react";

const IfBlock = (props: NodeProps) => {
  const [conditionsOpened, setConditionsOpened] = useState(false);
  const toggleConditions = () => {
    setConditionsOpened(!conditionsOpened);
  };

  return (
    <BaseBlock alignCenter title="If Condition" {...props}>
      <CustomHandle type="target" position={Position.Top} />
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
            id={`${props.id}-success`}
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
            id={`${props.id}-failure}`}
            bottom={-3}
            type="source"
            position={Position.Bottom}
          />
        </Grid>
      </Stack>
      <ConditionsBuilder opened={conditionsOpened} onClose={toggleConditions} />
    </BaseBlock>
  );
};

export default IfBlock;
