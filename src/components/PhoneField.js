import { TextField } from '@mui/material';

export default function PhoneField({ input, onChange }) {
  // Function to format phone number
  const formatPhoneNumber = (value) => {
    // Remove non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');

    // Format the number based on length
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const formatted = formatPhoneNumber(value);
    onChange({ target: { name: 'phone', value: formatted } });
  };

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
    />
  );
}
