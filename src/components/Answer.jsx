import { useContext, useState, memo, useCallback } from '@wordpress/element'; // Import memo, useCallback
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
	DatePicker,
	TimePicker,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddressAutoComplete from './AddressAutoComplete';
import ServiceSelect from './ServiceSelect';
import PhoneField from './PhoneField';
import parse from 'html-react-parser';
import { GlobalStateContext } from '../state';
import { Switch, Box } from '@mui/material';

// Wrap component in React.memo
// Accept 'questionInputs', 'errors', and 'services' as props
const Answer = memo(
	({ questionInputs, onInputChange, onDateChange, errors, services }) => {
		// Ensure questionInputs is an array before mapping
		const inputs = Array.isArray(questionInputs) ? questionInputs : [];

		// Use useCallback for handlers if they have complex logic or dependencies
		// that might change, otherwise inline functions are often fine.
		const handleDateChange = useCallback(
			(name, date) => {
				// Call the callback prop passed from ConversationalForm
				if (onDateChange) {
					onDateChange(name, date);
				}
			},
			[onDateChange]
		); // Dependency: the callback prop itself

		const handleInputChange = useCallback(
			(event) => {
				const { name, value, type, checked } = event.target;
				// Call the callback prop passed from ConversationalForm
				if (onInputChange) {
					onInputChange(name, type === 'checkbox' ? checked : value);
				}
			},
			[onInputChange]
		); // Dependency: the callback prop itself

		return (
			<Box sx={{ px: 4 }}>
				{/* Map over the 'inputs' array derived from props */}
				{inputs.map((input) => {
					// --- SIMPLIFIED RENDERING FOR DEBUGGING ---

					// Keep basic text/email/textarea fields
					if (input.type === 'text' || input.type === 'email') {
						return (
							<TextField
								key={input.name} // Use stable key
								label={input.label}
								name={input.name}
								value={input.value || ''} // Ensure value is controlled (not undefined/null)
								onChange={handleInputChange}
								fullWidth
								variant="outlined"
								margin="normal"
								error={!!errors[input.name]}
								helperText={errors[input.name]}
								required={!input.optional}
								size="small"
							/>
						);
					} else if (input.type === 'textarea') {
						// Keep this as it's just a TextField variant
						return (
							<TextField
								key={input.name}
								label={input.label}
								name={input.name}
								value={input.value || ''}
								onChange={handleInputChange}
								fullWidth
								required={!input.optional}
								variant="outlined"
								margin="normal"
								size="small"
								multiline
								rows={3}
							/>
						);
					} else if (input.type === 'tel') {
						// Re-enable PhoneField
						return (
							<PhoneField
								input={input}
								key={input.name}
								onChange={handleInputChange}
								errors={errors} // Pass down errors prop
							/>
						);
					} else if (input.type === 'geo') {
						// Re-enable AddressAutoComplete
						// Assuming AddressAutoComplete calls onInputChange internally or via its own prop
						// It might need the 'errors' prop as well if it displays errors.
						return (
							<AddressAutoComplete
								input={input}
								key={input.name}
								onInputChange={onInputChange}
								errors={errors}
							/>
						);
						// return <div key={input.name}>Address AutoComplete Disabled</div>;
					} else if (input.type === 'checkbox') {
						// Re-enable Checkbox/Switch
						return (
							<FormControlLabel
								key={input.name} // Use stable key
								control={
									<Switch
										// Use !! to ensure boolean value for checked prop
										checked={!!input.value}
										onChange={handleInputChange} // Uses the main input handler
										name={input.name}
										required={!input.optional}
									/>
								}
								disableTypography={true}
								className="phoenix-conversational-form__consent-switch"
								// Ensure LOCALIZED is available or provide fallback
								label={parse(
									(typeof LOCALIZED !== 'undefined' &&
										LOCALIZED.SMS_CONTENT_MESSAGE) ||
										input.label ||
										''
								)}
							/>
						);
					} else if (input.type === 'select') {
						// Re-enable ServiceSelect
						// Assuming ServiceSelect calls onInputChange internally or via its own prop
						// Pass errors prop if needed for display within ServiceSelect
						// Pass services prop down
						return (
							<ServiceSelect
								input={input}
								key={input.name}
								onInputChange={onInputChange}
								errors={errors}
								services={services}
							/>
						);
					} else if (input.type === 'datetime') {
						// Re-enable DateTimePicker
						return (
							<LocalizationProvider
								dateAdapter={AdapterDateFns}
								key={input.name} // Use stable key
							>
								<Stack
									direction="row"
									spacing={2}
									sx={{ marginTop: '1rem' }}
								>
									<DatePicker
										label="Select Date"
										// Ensure value is Date object or null for the picker
										value={
											input.value
												? new Date(input.value)
												: null
										}
										// Pass input name along with the date
										onChange={(date) =>
											handleDateChange(input.name, date)
										}
										disablePast
										slotProps={{
											textField: {
												size: 'small',
												fullWidth: true,
											},
										}}
									/>
									<TimePicker
										label="Select Time"
										// Ensure value is Date object or null for the picker
										value={
											input.value
												? new Date(input.value)
												: null
										}
										// Pass input name along with the date
										onChange={(date) =>
											handleDateChange(input.name, date)
										}
										slotProps={{
											textField: {
												size: 'small',
												fullWidth: true,
											},
										}}
									/>
								</Stack>
							</LocalizationProvider>
						);
					} else {
						// Fallback placeholder if any unknown type exists
						return (
							<div
								key={input.name}
							>{`Unknown input type "${input.type}"`}</div>
						);
					}

					// Commented out original logic for reference:
					/*
				if (input.type === 'tel') {
					return (
						<PhoneField input={input} key={input.name} onChange={handleInputChange} />
					);
				}
				if (input.type === 'text') { ... }
				if (input.type === 'email') { ... }
				if (input.type === 'geo') {
					return <AddressAutoComplete input={input} key={input.name} onInputChange={onInputChange} />;
				}
				if (input.type === 'select') {
					return <ServiceSelect input={input} key={input.name} onInputChange={onInputChange} />;
				}
				if (input.type === 'textarea') { ... }
				if (input.type === 'checkbox') {
					return ( <FormControlLabel key={input.name} control={ <Switch checked={!!input.value} onChange={handleInputChange} name={input.name} required={!input.optional} /> } disableTypography={true} className="phoenix-conversational-form__consent-switch" label={parse( LOCALIZED.SMS_CONTENT_MESSAGE || input.label )} /> );
				}
				if (input.type === 'datetime') {
					return ( <LocalizationProvider dateAdapter={AdapterDateFns} key={input.name} > <Stack direction="row" spacing={2} sx={{ marginTop: '1rem' }} > <DatePicker label="Select Date" value={input.value ? new Date(input.value) : null} onChange={(date) => handleDateChange(input.name, date)} disablePast slotProps={{ textField: { size: 'small', fullWidth: true } }} /> <TimePicker label="Select Time" value={input.value ? new Date(input.value) : null} onChange={(date) => handleDateChange(input.name, date)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /> </Stack> </LocalizationProvider> );
				}
				return null;
				*/
					// --- END SIMPLIFIED RENDERING ---
				})}
			</Box>
		);
	}
); // Close React.memo

export default Answer;
