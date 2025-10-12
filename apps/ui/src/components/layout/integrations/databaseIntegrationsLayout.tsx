import { Outlet } from "react-router-dom";
import DatabaseTopbar from "./databaseTopbar";
import { Box } from "@mui/material";

const DatabaseIntegrationsLayout = () => {
  return (
    <div>
      <DatabaseTopbar />
      <Box sx={{ maxHeight: "84vh", overflowY: "auto", overflowX: "hidden" }}>
        <Outlet />
      </Box>
    </div>
  );
};

export default DatabaseIntegrationsLayout;
