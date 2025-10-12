import { Grid } from "@mui/material";
import Layout from "..";
import { Outlet } from "react-router-dom";
import IntegrationsSidebar from "./sidebar";

const IntegrationsLayout = () => {
  return (
    <Layout>
      <Grid container sx={{ height: "92vh" }}>
        <Grid size={2} sx={{ height: "100%" }}>
          <IntegrationsSidebar />
        </Grid>
        <Grid size={10}>
          <Outlet />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default IntegrationsLayout;
