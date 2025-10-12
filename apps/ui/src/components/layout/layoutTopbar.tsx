import { Paper, Stack } from "@mui/material";

const LayoutTopbar = () => {
  return (
    <Paper square sx={{ height: "8vh" }} elevation={1}>
      <Stack direction={"row"} gap={1}></Stack>
    </Paper>
  );
};

export default LayoutTopbar;
