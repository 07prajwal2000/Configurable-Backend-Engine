import {
  Paper,
  MenuList,
  Stack,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiDatabase } from "react-icons/fi";
import { MdOutlineVpnKey } from "react-icons/md";

const menuItems = [
  {
    title: "Databases",
    icon: <FiDatabase />,
    url: "/integrations/database/postgres",
    matcher() {
      return location.pathname.startsWith("/integrations/database/");
    },
  },
  {
    title: "KV Store",
    icon: <MdOutlineVpnKey />,
    url: "/integrations/kv/redis",
    matcher() {
      return location.pathname.startsWith("/integrations/kv/");
    },
  },
];

const IntegrationsSidebar = () => {
  const nav = useNavigate();
  const { palette } = useTheme();

  return (
    <Paper square elevation={1} sx={{ height: "100%" }}>
      <MenuList>
        <Stack gap={1}>
          {menuItems.map((item, i) => (
            <MenuItem onClick={() => nav(item.url)} key={i}>
              {item.icon && (
                <ListItemIcon
                  sx={{
                    color: item.matcher() ? palette.primary.main : "",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText>{item.title}</ListItemText>
            </MenuItem>
          ))}
        </Stack>
      </MenuList>
    </Paper>
  );
};

export default IntegrationsSidebar;
