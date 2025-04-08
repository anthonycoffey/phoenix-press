import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { useCallback } from '@wordpress/element'; // Removed useContext, useEffect, useState
// Removed: import { GlobalStateContext } from '../state';

// Accept input (containing current value), services, onInputChange, and errors via props
export default function ServiceSelect({
	input,
	services,
	onInputChange,
	errors,
}) {
	// Removed context usage
	// Removed internal selectedServices state
	// Removed useEffect hook

	// Ensure services is an array
	const availableServices = Array.isArray(services) ? services : [];
	// The parent (ConversationalForm) now stores the value for 'service_type' as an array of objects: [{value: ..., id: ...}]
	// We need to extract the 'value' strings from this array to determine the checked state.
	const currentSelectedObjects = Array.isArray(input?.value)
		? input.value
		: [];
	const currentSelectedValues = currentSelectedObjects.map(
		(obj) => obj.value
	);

	const handleCheckboxChange = useCallback(
		(event) => {
			const { value, checked } = event.target; // 'value' here is the service.value

			// Calculate the next array of selected service values (strings)
			const nextSelectedValues = checked
				? [...currentSelectedValues, value] // Add the value if checked
				: currentSelectedValues.filter(
						(serviceValue) => serviceValue !== value
					); // Remove the value if unchecked

			// Format the output to match the target structure: [{value: ..., id: ...}]
			const formattedOutputArray = availableServices
				.filter((service) => nextSelectedValues.includes(service.value))
				.map((service) => ({
					value: service.value,
					id: service.id,
				}));

			// Call the parent's handler with the correct input name and the formatted array of objects
			if (onInputChange && input?.name) {
				onInputChange(input.name, formattedOutputArray);
			}
		},
		[
			input?.name,
			currentSelectedValues,
			onInputChange,
			availableServices, // Add availableServices as a dependency
		]
	); // Depend on current value, callback, and the services list

	// Removed validateSelection function

	// Use error from props, checking specifically for this input's name
	const error = errors?.[input?.name];

	return (
		<FormControl
			component="fieldset"
			fullWidth
			margin="dense"
			error={!!error} // Use error state from props
			sx={{ mt: 2 }} // Add some top margin
		>
			<FormLabel component="legend">
				{input?.label || 'Select desired service(s)'}
			</FormLabel>
			<FormGroup>
				<Box
					className="phoenix-conversational-form__service-select"
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 0,
						padding: 0,
					}}
				>
					{/* Map over services received from props */}
					{availableServices.map((service) => (
						<FormControlLabel
							key={service.value} // Use service.value as key
							sx={{ margin: 0, padding: 0, lineHeight: 1 }}
							control={
								<Checkbox
									value={service.value} // The value associated with this checkbox
									// Check if the array of selected *values* includes this service's value
									checked={currentSelectedValues.includes(
										service.value
									)}
									onChange={handleCheckboxChange}
									// The name attribute on checkbox isn't strictly necessary here as we use value
									// name={service.name} // Original code had service.name, but service.value seems more appropriate
									name={input?.name || 'service_type'} // Use the group name
									size="small"
								/>
							}
							label={service.text}
						/>
					))}
				</Box>
			</FormGroup>
			{/* Display error message from props */}
			{error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
}
