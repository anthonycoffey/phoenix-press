import { useCallback } from '@wordpress/element'; // Removed useContext, useEffect
import TextField from '@mui/material/TextField';
// Removed: import { GlobalStateContext } from '../state';

// Accept errors via props now (passed down from ConversationalForm -> Answer)
export default function PhoneField({ input, onChange, errors }) {
	// Removed: const { errors, setErrors } = useContext(GlobalStateContext);

	// Formatting function remains the same
	const formatPhoneNumber = (value) => {
		if (!value) return ''; // Handle empty value
		const phoneNumber = value.replace(/\D/g, '');
		if (phoneNumber.length <= 3) return `(${phoneNumber}`;
		if (phoneNumber.length <= 6)
			return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
		return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
	};

	// Validation function (can be kept for local checks if needed, but primary validation is in parent)
	// const validatePhoneNumber = (value) => { ... };

	const handleInputChange = useCallback(
		(event) => {
			const { value } = event.target;
			const rawValue = value.replace(/\D/g, '').slice(0, 10); // Get raw digits, max 10
			const formatted = formatPhoneNumber(rawValue);

			// Call the parent's onChange handler with the CORRECT input name and the RAW digits value
			// Parent component (ConversationalForm) will handle validation based on the raw value
			if (onChange) {
				onChange({ target: { name: input.name, value: rawValue } }); // Pass raw digits
			}
			// Removed: setErrors({ ...errors, [input?.name]: errorMessage });
		},
		[input?.name, onChange]
	); // Use input.name from props

	// Removed the useEffect hook that was setting global errors

	return (
		<TextField
			label={input?.label || 'Phone Number'} // Use optional chaining
			name={input?.name || 'phone'} // Use optional chaining
			// Display the formatted value, but send raw digits up via onChange
			value={formatPhoneNumber(input?.value || '')} // Format the value from props for display
			onChange={handleInputChange}
			fullWidth
			variant="outlined"
			margin="normal"
			type="tel" // Keep type="tel" for semantics and mobile keyboards
			inputMode="tel" // Hint for mobile keyboards
			required={!input?.optional}
			// Get error state from props passed down via Answer
			error={!!errors?.[input?.name]}
			helperText={errors?.[input?.name] || ''}
			size="small"
			placeholder="(123) 456-7890"
		/>
	);
}
