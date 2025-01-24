import React, { useEffect } from "react";
import { TextField, FormControlLabel, Checkbox, Stack } from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PhoneField from "./EmbedForm/PhoneField";
import AddressAutoComplete from "./EmbedForm/AddressAutoComplete";
import Services from "./EmbedForm/Services";
import parse from "html-react-parser";

const InputField = ({
  input,
  handleTextChange,
  handleDateChange,
  handleConsentChange,
  selectedDate,
  setValidPhoneNumber,
  checked,
  setChecked,
  handleBlur,
}) => {
  useEffect(() => {
    if (input.type === "datetime") {
      handleDateChange({ input, event: selectedDate });
    }
  }, []);
  switch (input.type) {
    case "tel":
      return (
        <>
          <PhoneField input={input} setValidPhoneNumber={setValidPhoneNumber} />
        </>
      );
    case "text":
      return (
        <TextField
          label={input.label}
          name={input.name}
          onChange={(event) => handleTextChange({ input, event })}
          onBlur={handleBlur}
          fullWidth
          variant="outlined"
          margin="normal"
          required={!input.optional}
        />
      );
    case "geo":
      return <AddressAutoComplete input={input} />;
    case "select":
      return <Services input={input} />;
    case "checkbox":
      return (
        <FormControlLabel
          sx={{ marginBottom: "1rem" }}
          control={
            <Checkbox
              checked={checked}
              onChange={(event) => handleConsentChange({ input, event })}
              onBlur={handleBlur}
              name={input.name}
              required={!input.optional}
            />
          }
          label={parse(LOCALIZED.SMS_CONSENT_MESSAGE || input.label)}
        />
      );
    case "datetime":
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack
            direction="row"
            spacing={4}
            sx={{ marginTop: "1rem", justifyContent: "space-between" }}
          >
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(event) => handleDateChange({ input, event })}
              onBlur={handleBlur}
              disablePast
              fullWidth
            />
            <TimePicker
              label="Select Time"
              value={selectedDate}
              onChange={(event) => handleDateChange({ input, event })}
              onBlur={handleBlur}
              fullWidth
            />
          </Stack>
        </LocalizationProvider>
      );
    case "textarea":
      return (
        <TextField
          label={input.label}
          name={input.name}
          value={input.value}
          onChange={(event) => handleTextChange({ input, event })}
          fullWidth
          multiline
          rows={2}
          required={!input.optional}
          variant="outlined"
          margin="normal"
        />
      );
    default:
      return null;
  }
};

export default InputField;
