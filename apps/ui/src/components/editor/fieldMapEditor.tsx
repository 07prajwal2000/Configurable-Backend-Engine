import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdAddCircleOutline, MdDelete, MdLink } from "react-icons/md";
import { showToast } from "../toasts";

type FieldMapEditorProps = {
  onSave?: (map: Record<string, string>) => void;
  open: boolean;
  onClose?: () => void;
  defaultMap?: Record<string, string>;
  defaultFields?: string[];
};

const FieldMapEditor = (props: FieldMapEditorProps) => {
  const [fieldMap, setFieldMap] = useState<{ source: string; dest: string }[]>(
    Object.keys(props.defaultMap || {}).map((key) => ({
      source: key,
      dest: props.defaultMap![key],
    }))
  );
  useEffect(() => {
    setFieldMap(
      Object.keys(props.defaultMap || {}).map((key) => ({
        source: key,
        dest: props.defaultMap![key],
      }))
    );
  }, [props.defaultMap]);

  function onSourceChanged(value: string, idx: number) {
    const newMap = [...fieldMap];
    newMap[idx].source = value;
    setFieldMap(newMap);
  }
  function onDestinationChanged(value: string, idx: number) {
    const newMap = [...fieldMap];
    newMap[idx].dest = value;
    setFieldMap(newMap);
  }
  function onSaveClicked() {
    const map: Record<string, string> = {};
    const processedDest = new Set();
    for (let kvp of fieldMap) {
      if (kvp.source.trim() === "" || kvp.dest.trim() === "") {
        showToast(
          {
            message: "Source/Destination cannot be empty",
            type: "error",
          },
          true
        );
        return;
      }
      if (processedDest.has(kvp.dest) || kvp.source in map) {
        showToast(
          {
            message: "No duplicate Source/Destination allowed",
            type: "error",
          },
          true
        );
        return;
      }

      map[kvp.source] = kvp.dest;
    }
    props.onSave?.(map);
    props.onClose?.();
  }
  function hasDuplicate(type: "source" | "dest", value: string) {
    let count = 0;
    for (let i = 0; i < fieldMap.length; i++) {
      if (fieldMap[i][type] === value) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
  }
  function onAddClicked() {
    setFieldMap([...fieldMap, { source: "", dest: "" }]);
  }
  function onDeleteClicked(idx: number) {
    const newMap = [...fieldMap];
    newMap.splice(idx, 1);
    setFieldMap(newMap);
  }
  function close() {
    setFieldMap(
      Object.keys(props.defaultMap || {}).map((key) => ({
        source: key,
        dest: props.defaultMap![key],
      })) || []
    );
    props.onClose && props.onClose();
  }

  return (
    <Drawer anchor="bottom" open={props.open} onClose={close}>
      <Box sx={{ p: 2 }}>
        <Stack
          mb={1}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5">Edit Field Map</Typography>
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={onAddClicked}
            startIcon={<MdAddCircleOutline />}
          >
            Add New Field Map
          </Button>
        </Stack>
        <Divider />
        <Stack
          direction={"column"}
          gap={1}
          sx={{
            minHeight: 100,
            maxHeight: 300,
            overflowY: "auto",
            my: 1,
            py: 1,
          }}
        >
          {fieldMap.map((kvp, i) => (
            <Grid container key={i} gap={1}>
              <Grid size={3}>
                <Autocomplete
                  freeSolo
                  size="small"
                  onInputChange={(_, val) => onSourceChanged(val, i)}
                  fullWidth
                  value={kvp.source}
                  options={props.defaultFields || []}
                  renderInput={(params) => (
                    <TextField
                      error={hasDuplicate("source", kvp.source)}
                      {...params}
                      label={"Source Key"}
                    />
                  )}
                />
              </Grid>
              <Grid
                size={1}
                container
                justifyContent={"center"}
                alignItems={"center"}
              >
                <div>
                  <MdLink size={35} />
                </div>
              </Grid>
              <Grid size={3}>
                <TextField
                  onChange={(e) => onDestinationChanged(e.target.value, i)}
                  value={kvp.dest}
                  error={hasDuplicate("dest", kvp.dest)}
                  size="small"
                  fullWidth
                  label={"Destination Key"}
                />
              </Grid>
              <Grid size={1}>
                <IconButton onClick={() => onDeleteClicked(i)} color="error">
                  <MdDelete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          {fieldMap.length == 0 && (
            <Typography
              textAlign={"center"}
              fontSize={20}
              color="textDisabled"
              textTransform={"uppercase"}
            >
              Add a new field map to edit
            </Typography>
          )}
        </Stack>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={onSaveClicked}
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default FieldMapEditor;
