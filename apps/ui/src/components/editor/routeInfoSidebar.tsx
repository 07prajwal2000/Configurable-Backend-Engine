import {
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useBlockEditorContext } from "../../context/blockEditorContext";
import { MdSave } from "react-icons/md";

const RouteInfoSidebar = () => {
  const { routeData } = useBlockEditorContext();

  return (
    <Stack sx={{ width: "92%" }} gap={2}>
      <Stack
        gap={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h6">Route Info</Typography>
        <IconButton color="primary">
          <MdSave />
        </IconButton>
      </Stack>
      <Divider />
      <TextField label="ID" size="small" value={routeData.id} disabled />
      <TextField label="Route Name" size="small" value={routeData.name} />
      <TextField label="Path" size="small" value={routeData.path} />
    </Stack>
  );
};

export default RouteInfoSidebar;
