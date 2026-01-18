import { useState, useEffect } from '@wordpress/element';
import TextField from '@mui/material/TextField';

export default function PhoneField({
	input,
	handleBlur,
	handleTextChange,
	setValidPhoneNumber,
	error,
}) {
	const [value, setValue] = useState(input.value || '');

	useEffect(() => {
		setValue(input.value || '');
	}, [input.value]);

	const formatPhoneNumber = (val) => {
		const phoneNumber = val.replace(/\D/g, '');

		if (phoneNumber.length <= 3) {
			return phoneNumber;
		} else if (phoneNumber.length <= 6) {
			return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
		} else {
			return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
		}
	};

	const handleInputChange = (event) => {
		const { value: inputValue } = event.target;
		const phoneNumber = inputValue.replace(/\D/g, '');

		if (setValidPhoneNumber) {
			setValidPhoneNumber(phoneNumber.length === 10);
		}

		const formatted = formatPhoneNumber(inputValue);
		setValue(formatted);
		handleTextChange({ input, event: { target: { value: formatted } } });
	};

	return (
		<TextField
			label={input.label}
			name={input.name}
			value={value}
			onChange={handleInputChange}
			onBlur={() => handleBlur({ input })}
			fullWidth
			variant="outlined"
			margin="normal"
			type="tel"
			required={!input.optional}
			error={!!error}
			helperText={error}
		/>
	);
}
