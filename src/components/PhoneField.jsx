const TextField = MaterialUI.TextField;
import React, { useContext, useEffect } from "@wordpress/element";
import { GlobalStateContext } from "../state";

export default function PhoneField({ input, onChange }) {
  const { errors, setErrors } = useContext(GlobalStateContext);
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
    setErrors({ ...errors, [input?.name]: errorMessage });
    onChange({ target: { name: "phone", value: formatted } });
  };

  useEffect(() => {
    const errorMessage = validatePhoneNumber(input.value);
    setErrors({ ...errors, [input.name]: errorMessage });
  }, [input.value, setErrors, errors, input.name]);

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
