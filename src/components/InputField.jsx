import { useEffect } from "@wordpress/element";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PhoneField from "./PhoneField";
import AddressAutoComplete from "./AddressAutoComplete";
import Services from "./ServiceSelect";
const TextField = MaterialUI.TextField;
const FormControlLabel = MaterialUI.FormControlLabel;
const Checkbox = MaterialUI.Checkbox;
const Stack = MaterialUI.Stack;
import parse from "html-react-parser";

const InputField = ({
  input,
  handleTextChange,
  handleDateChange,
  handleConsentChange,
  selectedDate,
  setValidPhoneNumber,
  checked,
  handleBlur,
}) => {
  useEffect(() => {
    if (input.type === "datetime") {
      handleDateChange({ input, event: selectedDate });
    }
    return () => {
      // Cleanup if necessary
    };
  }, [input, selectedDate, handleDateChange]);

  switch (input.type) {
    case "tel":
      return (
        <PhoneField
          input={input}
          setValidPhoneNumber={setValidPhoneNumber}
          handleBlur={handleBlur}
        />
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
      return <AddressAutoComplete input={input} handleBlur={handleBlur} />;
    case "select":
      return <Services input={input} handleBlur={handleBlur} />;
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
            sx={{
              marginTop: "1rem",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(event) => handleDateChange({ input, event })}
              onAccept={handleBlur}
              disablePast
              fullWidth
            />
            <TimePicker
              label="Select Time"
              value={selectedDate}
              onChange={(event) => handleDateChange({ input, event })}
              onAccept={handleBlur}
              fullWidth
            />
          </Stack>
        </LocalizationProvider>
      );
    default:
      return null;
  }
};

export default InputField;
