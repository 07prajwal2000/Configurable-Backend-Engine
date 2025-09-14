import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

type Route = {
  id: string;
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  createdAt: string;
};

type CreateRouteRequest = {
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

interface RouteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRouteRequest) => void;
  initialData?: Route | null;
  loading: boolean;
}

const RouteFormModal: React.FC<RouteFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateRouteRequest>({
    name: "",
    path: "",
    method: "GET",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        path: initialData.path,
        method: initialData.method,
      });
    } else {
      setFormData({
        name: "",
        path: "",
        method: "GET",
      });
    }
  }, [initialData, open]);

  const handleTextChange =
    (field: keyof CreateRouteRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof CreateRouteRequest) => (event: SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Route" : "Create Route"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleTextChange("name")}
        />
        <TextField
          margin="dense"
          label="Path"
          fullWidth
          variant="outlined"
          value={formData.path}
          onChange={handleTextChange("path")}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Method</InputLabel>
          <Select
            value={formData.method}
            onChange={handleSelectChange("method")}
            label="Method"
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteFormModal;
