import TextField from '@mui/material/TextField';

export default function PhoneField({
	input,
	handleBlur,
	handleTextChange,
	error,
}) {
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

	const handleInputChange = (event) => {
		const { value } = event.target;
		const formatted = formatPhoneNumber(value);
		handleTextChange({ input, event: { target: { value: formatted } } });
	};

	return (
		<TextField
			label={input.label}
			name={input.name}
			value={input.value}
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
