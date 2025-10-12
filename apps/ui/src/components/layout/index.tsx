import { Grid, Stack } from "@mui/material";
import type React from "react";
import LayoutSidebar from "./layoutSidebar";
import LayoutTopbar from "./layoutTopbar";

type LayoutProps = React.PropsWithChildren & {};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Stack
      direction={"column"}
      sx={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <LayoutTopbar />
      <Grid container height={"92vh"}>
        <Grid size={2}>
          <LayoutSidebar />
        </Grid>
        <Grid size={10}>{children}</Grid>
      </Grid>
    </Stack>
  );
};

export default Layout;
