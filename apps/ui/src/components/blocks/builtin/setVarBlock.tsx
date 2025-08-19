import { Position, type NodeProps } from "@xyflow/react";
import BaseBlock from "../baseBlock";
import type z from "zod";
import type { setVarSchema } from "@cbe/blocks";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import CustomHandle from "../../handle";

interface SetVarProps extends NodeProps {
  data: z.infer<typeof setVarSchema>;
}

const SetVarBlock = (props: SetVarProps) => {
  const primaryColor = useTheme().palette.primary;

  return (
    <BaseBlock {...props} title="Set Variable">
      <Box>
        <CustomHandle type="target" position={Position.Top} />
        <CustomHandle type="source" position={Position.Bottom} />
      </Box>
      <Stack direction={"column"} gap={0.2}>
        <Grid container direction={"row"} gap={1} alignItems={"center"}>
          <Grid size={3}>
            <Typography fontSize={6}>Name</Typography>
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
              }}
            >
              {props.data.key || "."}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          mb={0.6}
          container
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <Grid size={3}>
            <Typography fontSize={6}>Value</Typography>
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
              }}
            >
              {typeof props.data.value === "string" &&
              props.data.value.startsWith("js:")
                ? "js"
                : props.data.value || "."}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </BaseBlock>
  );
};

export default SetVarBlock;
