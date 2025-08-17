import { Box, Grid, Paper, Typography } from "@mui/material";
import BlockEditor from "../components/editor/blockEditor";
import EditorSidebar from "../components/editor/editorSidebar";

const Editor = () => {
  return (
    <Grid
      container
      sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      <Grid size={9}>
        <Paper
          sx={{
            margin: 1,
            p: 1,
          }}
        >
          <Typography fontSize={18}>Top bar</Typography>
        </Paper>
        <BlockEditor />
      </Grid>
      <Grid size={3}>
        <Paper
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={{ height: "5vh", p: 0 }}>
            <Typography fontSize={25}>Right</Typography>
          </Box>
          <Box
            sx={{ width: "100%", maxHeight: "92vh", overflowY: "auto" }}
            p={2}
          >
            <EditorSidebar />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Editor;
