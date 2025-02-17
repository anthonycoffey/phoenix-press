import { useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';

export default function PhoneField({ input, setValidPhoneNumber, handleBlur }) {
	const [errors, setErrors] = useState({});
	const formatPhoneNumber = (value) => {
		const phoneNumber = value.replace(/\D/g, '');

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
		const phoneNumber = value.replace(/\D/g, '');
		const valid = phoneNumber.length !== 10;
		setValidPhoneNumber(true);
		return valid ? 'Valid phone number is required.' : '';
	};

	const handleInputChange = (event) => {
		const { value } = event.target;
		const formatted = formatPhoneNumber(value);
		const errorMessage = validatePhoneNumber(formatted);
		setErrors({ ...errors, [input.name]: errorMessage });
		input.value = formatted;
	};

	return (
		<TextField
			label={input.label}
			name={input.name}
			value={input.value}
			onChange={handleInputChange}
			onBlur={handleBlur}
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
