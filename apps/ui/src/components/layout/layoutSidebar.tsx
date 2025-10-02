import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
} from "@mui/material";
import {
  MdAltRoute,
  MdOutlineDashboard,
  MdOutlineRocketLaunch,
} from "react-icons/md";
import { useNavigate } from "react-router";
import { VscVariableGroup } from "react-icons/vsc";

const menuItems = [
  {
    title: "Dashboard",
    icon: <MdOutlineDashboard />,
    url: "/",
  },
  {
    title: "Routes",
    icon: <MdAltRoute />,
    url: "/routes",
  },
  {
    title: "Deployment Config",
    icon: <MdOutlineRocketLaunch />,
    url: "/deploy-config",
  },
  {
    title: "App Config",
    icon: <VscVariableGroup />,
    url: "/appconfig",
  },
];

const LayoutSidebar = () => {
  const nav = useNavigate();

  return (
    <Paper square elevation={1} sx={{ height: "100%" }}>
      <MenuList>
        <Stack gap={1}>
          {menuItems.map((item, i) => (
            <MenuItem onClick={() => nav(item.url)} key={i}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>{item.title}</ListItemText>
            </MenuItem>
          ))}
        </Stack>
      </MenuList>
    </Paper>
  );
};

export default LayoutSidebar;
