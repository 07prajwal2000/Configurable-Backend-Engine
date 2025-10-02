import { Paper, Stack } from "@mui/material";

const LayoutTopbar = () => {
  return (
    <Paper square sx={{ height: "8%" }} elevation={1}>
      <Stack direction={"row"} gap={1}></Stack>
    </Paper>
  );
};

export default LayoutTopbar;
