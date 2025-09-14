import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

type Route = {
  id: string;
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  createdAt: string;
};

interface RouteDetailsModalProps {
  open: boolean;
  onClose: () => void;
  route: Route | null;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  open,
  onClose,
  route,
}) => {
  if (!route) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Route Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            ID
          </Typography>
          <Typography variant="body1">{route.id}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Name
          </Typography>
          <Typography variant="body1">{route.name || "N/A"}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Path
          </Typography>
          <Typography variant="body1">{route.path}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Method
          </Typography>
          <Typography variant="body1">{route.method}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Created At
          </Typography>
          <Typography variant="body1">
            {new Date(route.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteDetailsModal;
