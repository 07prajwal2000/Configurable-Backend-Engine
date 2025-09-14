import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { MdMoreVert } from "react-icons/md";

type Route = {
  id: string;
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  createdAt: string;
};

interface RouteTableProps {
  routes: Route[];
  loading: boolean;
  onEdit: (route: Route) => void;
  onDelete: (routeId: string) => void;
  onOpenEditor: (routeId: string) => void;
  onViewDetails: (route: Route) => void;
}

const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  loading,
  onEdit,
  onDelete,
  onOpenEditor,
  onViewDetails,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRoute, setSelectedRoute] = React.useState<Route | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    route: Route
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoute(route);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoute(null);
  };

  const handleEdit = () => {
    if (selectedRoute) onEdit(selectedRoute);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedRoute) onDelete(selectedRoute.id);
    handleMenuClose();
  };

  const handleOpenEditor = () => {
    if (selectedRoute) onOpenEditor(selectedRoute.id);
    handleMenuClose();
  };

  const handleViewDetails = () => {
    if (selectedRoute) onViewDetails(selectedRoute);
    handleMenuClose();
  };

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={80} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={50} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={150} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={24} height={24} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Path</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => onViewDetails(route)}
                >
                  {route.path}
                </Typography>
              </TableCell>
              <TableCell>{route.method}</TableCell>
              <TableCell>{route.name || "N/A"}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="more"
                  onClick={(e) => handleMenuClick(e, route)}
                >
                  <MdMoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleOpenEditor}>Open Editor</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </TableContainer>
  );
};

export default RouteTable;
