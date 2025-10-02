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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { z } from "zod";
import type {
  AppConfig,
  CreateAppConfigRequest,
  UpdateAppConfigRequest,
} from "../services/types";

// Import zod schemas from server
const createAppConfigSchema = z.object({
  keyName: z
    .string()
    .min(1, "Key name is required")
    .max(100, "Key name too long"),
  description: z.string().optional(),
  value: z.string().min(1, "Value is required"),
  isEncrypted: z.boolean().default(false),
  encoding_type: z.enum(["plaintext", "base64", "hex"]).default("plaintext"),
});

const updateAppConfigSchema = z.object({
  keyName: z
    .string()
    .min(1, "Key name is required")
    .max(100, "Key name too long")
    .optional(),
  description: z.string().optional(),
  value: z.string().min(1, "Value is required").optional(),
  isEncrypted: z.boolean().optional(),
  encoding_type: z.enum(["plaintext", "base64", "hex"]).optional(),
});

type FormData = CreateAppConfigRequest | UpdateAppConfigRequest;

interface AppConfigFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: AppConfig | null;
  loading: boolean;
  mode: "create" | "edit" | "view";
}

const AppConfigFormModal: React.FC<AppConfigFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading,
  mode,
}) => {
  const [formData, setFormData] = useState<FormData>({
    keyName: "",
    description: "",
    value: "",
    isEncrypted: false,
    encoding_type: "plaintext",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && (mode === "edit" || mode === "view")) {
      setFormData({
        keyName: initialData.keyName,
        description: initialData.description || "",
        value: initialData.isEncrypted
          ? "*".repeat(20)
          : initialData.value || "",
        isEncrypted: initialData.isEncrypted,
        encoding_type: initialData.encoding_type,
      });
    } else {
      setFormData({
        keyName: "",
        description: "",
        value: "",
        isEncrypted: false,
        encoding_type: "plaintext",
      });
    }
    setErrors({});
  }, [initialData, open, mode]);

  const validateForm = () => {
    try {
      const schema =
        mode === "create" ? createAppConfigSchema : updateAppConfigSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleTextChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange =
    (field: keyof FormData) => (event: SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleCheckboxChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "view"
          ? "View App Config"
          : initialData
          ? "Edit App Config"
          : "Create App Config"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={!isReadOnly}
          margin="dense"
          label="Key Name"
          fullWidth
          variant="outlined"
          value={formData.keyName}
          onChange={handleTextChange("keyName")}
          error={!!errors.keyName}
          helperText={errors.keyName}
          required
          InputProps={{ readOnly: isReadOnly }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={formData.description}
          onChange={handleTextChange("description")}
          InputProps={{ readOnly: isReadOnly }}
        />
        <TextField
          margin="dense"
          label="Value"
          fullWidth
          variant="outlined"
          type={formData.isEncrypted ? "password" : "text"}
          value={formData.value}
          onChange={handleTextChange("value")}
          error={!!errors.value}
          helperText={errors.value}
          required
          InputProps={{ readOnly: isReadOnly }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Encoding Type</InputLabel>
          <Select
            value={formData.encoding_type}
            onChange={handleSelectChange("encoding_type")}
            label="Encoding Type"
            disabled={isReadOnly || mode === "edit"}
          >
            <MenuItem value="plaintext">Plaintext</MenuItem>
            <MenuItem value="base64">Base64</MenuItem>
            <MenuItem value="hex">Hex</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isEncrypted}
              onChange={handleCheckboxChange("isEncrypted")}
              disabled={
                isReadOnly || (mode === "edit" && initialData?.isEncrypted)
              }
            />
          }
          label="Encrypted"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!isReadOnly && (
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppConfigFormModal;
