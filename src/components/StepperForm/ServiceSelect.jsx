import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function ServiceSelect({
  input,
  handleServiceChange,
  handleBlur,
}) {
  return (
    <TextField
      select
      label="Select a service"
      value={input.value}
      onChange={(event) => handleServiceChange({ input, event })}
      onBlur={handleBlur}
      fullWidth
      variant="outlined"
      margin="normal"
      required={!input.optional}
    >
      {input.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
