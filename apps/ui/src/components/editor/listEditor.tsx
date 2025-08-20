import {
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdAddCircleOutline, MdClose, MdDelete, MdSave } from "react-icons/md";

type ListEditorProps = {
  open: boolean;
  title: string;
  onClose?: () => void;
  onSave?: (values: string[]) => void;
  values?: any[] | string;
};

const ListEditor = (props: ListEditorProps) => {
  const initialItems = (props.values as string[]) || [];
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [props.values]);

  function onSaveClicked() {
    props.onSave && props.onSave(items);
    props.onClose && props.onClose();
  }
  function onItemChange(value: string | any, idx: number) {
    const newItems = [...items];
    newItems[idx] = value;
    setItems(newItems);
  }
  function onAddClicked() {
    setItems([...items, ""]);
  }
  function onDeleteClicked(idx: number) {
    const newItems = [...items];
    newItems.splice(idx, 1);
    setItems(newItems);
  }
  function close() {
    setItems(initialItems);
    props.onClose && props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={close}>
      <Stack gap={1} direction={"column"} sx={{ p: 1 }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h6">{props.title}</Typography>
          <IconButton onClick={close}>
            <MdClose />
          </IconButton>
        </Stack>
        <Divider />
        <Stack
          direction={"column"}
          sx={{ minHeight: 350, width: 450, maxHeight: 350, overflowY: "auto" }}
          gap={1}
        >
          {items.map((item, i) => (
            <Grid
              container
              key={i}
              alignItems={"center"}
              direction={"row"}
              gap={1}
            >
              <Grid size={1}>
                <Typography>{i + 1}.</Typography>
              </Grid>
              <Grid size={9}>
                <TextField
                  onChange={(e) => onItemChange(e.target.value, i)}
                  fullWidth
                  size="small"
                  value={item}
                  key={i}
                />
              </Grid>
              <Grid size={1}>
                <IconButton onClick={() => onDeleteClicked(i)} color="error">
                  <MdDelete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          {items.length == 0 && (
            <Typography color="textDisabled" fontSize={20} textAlign={"center"}>
              Add items to edit
            </Typography>
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} gap={1}>
          <Button
            variant="outlined"
            color="info"
            startIcon={<MdAddCircleOutline />}
            onClick={onAddClicked}
          >
            Add Item
          </Button>
          <Stack direction={"row"} gap={1}>
            <Button
              startIcon={<MdSave />}
              variant="outlined"
              color="success"
              onClick={onSaveClicked}
            >
              Save
            </Button>
            <Button onClick={close} variant="text">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ListEditor;
