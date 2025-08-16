import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { conditionSchema } from "@cbe/blocks";
import type z from "zod";
import InputWithJs from "./inputWithJs";
import { operatorSchema } from "@cbe/lib";

export type SavedConditionsType = z.infer<typeof conditionSchema>;

interface ConditionsBuilderProps {
  opened: boolean;
  onClose?: () => void;
  onSave?: (value: SavedConditionsType) => void;
}

const ConditionsBuilder = (props: ConditionsBuilderProps) => {
  function onSaveClicked() {
    // props.onSave
  }

  return (
    <Drawer anchor="bottom" open={props.opened} onClose={props.onClose}>
      <Box sx={{ p: 2 }}>
        <Stack direction={"column"} gap={4}>
          <Stack gap={1}>
            <Typography variant="h5">Edit Conditions</Typography>
            <Divider />
          </Stack>
          <Box>
            <Grid container direction={"row"} gap={2}>
              <Grid size={2}>
                <InputWithJs
                  fullWidth
                  variant="outlined"
                  label="LHS"
                  size="small"
                />
              </Grid>
              <Grid size={2}>
                <FormControl fullWidth>
                  <InputLabel id="op">Operator</InputLabel>
                  <Select
                    labelId="op"
                    defaultValue={operatorSchema.enum.eq}
                    label="Operator"
                    size="small"
                  >
                    {Object.values(operatorSchema.enum).map((x) => (
                      <MenuItem value={x}>{x.toUpperCase()}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={2}>
                <InputWithJs
                  fullWidth
                  variant="outlined"
                  label="RHS"
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
          <Button onClick={onSaveClicked} variant="contained" color="success">
            Save Conditions
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default ConditionsBuilder;
