import { TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function PhoneField({ input, setValidPhoneNumber }) {
  const [errors, setErrors] = useState({});
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");

    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Function to validate phone number
  const validatePhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");
    return phoneNumber.length !== 10 ? "Valid phone number is required." : "";
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const formatted = formatPhoneNumber(value);
    const errorMessage = validatePhoneNumber(formatted);
    setErrors({ ...errors, [input.name]: errorMessage });
    input.value = formatted;
  };

  useEffect(() => {
    setValidPhoneNumber(!errors[input.name]);
  }, [errors]);

  return (
    <TextField
      label={input.label}
      name={input.name}
      value={input.value}
      onChange={handleInputChange}
      fullWidth
      variant="outlined"
      margin="normal"
      type="tel"
      required={!input.optional}
      error={!!errors[input.name]}
      helperText={errors[input.name]}
    />
  );
}
