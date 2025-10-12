import { Button, Divider, Stack } from "@mui/material";
import { DiMongodb, DiPostgresql } from "react-icons/di";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "PostgreSQL",
    icon: <DiPostgresql />,
    url: "/integrations/database/postgres",
    matcher() {
      return location.pathname.includes("/integrations/database/postgres");
    },
  },
  {
    title: "MongoDB",
    icon: <DiMongodb />,
    url: "/integrations/database/mongodb",
    matcher() {
      return location.pathname.includes("/integrations/database/mongodb");
    },
  },
];

const DatabaseTopbar = () => {
  const nav = useNavigate();

  return (
    <Stack
      direction={"column"}
      gap={1}
      sx={{
        height: "8vh",
      }}
      justifyContent={"center"}
    >
      <Stack direction={"row"} gap={1} px={2}>
        {menuItems.map((item) => (
          <Button
            onClick={() => nav(item.url)}
            startIcon={item.icon}
            key={item.title}
            color="info"
            variant={item.matcher() ? "contained" : "outlined"}
          >
            {item.title}
          </Button>
        ))}
      </Stack>
      <Divider />
    </Stack>
  );
};

export default DatabaseTopbar;
