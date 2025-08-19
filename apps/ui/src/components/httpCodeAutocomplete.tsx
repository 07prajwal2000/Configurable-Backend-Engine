import { Autocomplete, TextField, type SxProps } from "@mui/material";

const httpCodes = [200, 201, 400, 401, 402, 403, 404, 500, 501];

type HttpCodeAutocompleteProps = {
  autoCompleteSx?: SxProps;
};

const HttpCodeAutocomplete = (props: HttpCodeAutocompleteProps) => {
  return (
    <Autocomplete
      freeSolo
      options={httpCodes}
      size="small"
      defaultValue={200}
      renderInput={(params) => (
        <TextField sx={props.autoCompleteSx} {...params} />
      )}
    />
  );
};

export default HttpCodeAutocomplete;
