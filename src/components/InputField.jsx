import { useEffect } from '@wordpress/element';
import {
	DatePicker,
	TimePicker,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddressAutoComplete from './EmbedForm/AddressAutoComplete';
import PhoneField from './EmbedForm/PhoneField';
import Services from './EmbedForm/Services'
import ServiceSelect from './StepperForm/ServiceSelect';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import parse from 'html-react-parser';

const InputField = ({
	input,
	handleTextChange,
	handleDateChange,
	handleConsentChange,
	selectedDate,
	setValidPhoneNumber,
	checked,
	handleBlur,
	handleServiceChange,
	error,
}) => {
	useEffect(() => {
		if (input.type === 'datetime') {
			handleDateChange({ input, event: selectedDate });
		}
		return () => {
			// Cleanup if necessary
		};
	}, [input, selectedDate, handleDateChange]);

	switch (input.type) {
		case 'tel':
			return (
				<PhoneField
					input={input}
					setValidPhoneNumber={setValidPhoneNumber}
					handleBlur={handleBlur}
					handleTextChange={handleTextChange}
					error={error}
				/>
			);
		case 'text':
			return (
				<TextField
					label={input.label}
					name={input.name}
					onChange={(event) => handleTextChange({ input, event })}
					onBlur={() => handleBlur({ input })}
					fullWidth
					variant="outlined"
					margin="normal"
					required={!input.optional}
					error={!!error}
					helperText={error}
				/>
			);
		case 'email':
			return (
				<TextField
					label={input.label}
					name={input.name}
					onChange={(event) => handleTextChange({ input, event })}
					onBlur={() => handleBlur({ input })}
					fullWidth
					autoCapitalize="email"
					variant="outlined"
					margin="normal"
					required={!input.optional}
					error={!!error}
					helperText={error}
				/>
			);
		case 'geo':
			return (
				<AddressAutoComplete
					input={input}
					handleBlur={() => handleBlur({ input })}
				/>
			);
		case 'dropdown':
			return (
				<ServiceSelect
					input={input}
					handleServiceChange={handleServiceChange}
					handleBlur={() => handleBlur({ input })}
					error={error}
				/>
			);
		case 'select':
			return (
				<Services
					input={input}
					handleBlur={() => handleBlur({ input })}
				/>
			);
		case 'checkbox':
			return (
				<FormControlLabel
					sx={{ marginBottom: '1rem' }}
					size="small"
					control={
						<Checkbox
							checked={checked}
							onChange={(event) =>
								handleConsentChange({ input, event })
							}
							onBlur={() => handleBlur({ input })}
							name={input.name}
							required={!input.optional}
						/>
					}
					label={parse(
						LOCALIZED.SMS_CONSENT_MESSAGE || input.label || ''
					)}
				/>
			);
		case 'datetime':
			return (
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Stack
						direction="row"
						spacing={4}
						sx={{
							marginTop: '1rem',
							justifyContent: 'space-around',
							width: '100%',
						}}
					>
						<DatePicker
							label="Select Date"
							value={selectedDate}
							onChange={(event) =>
								handleDateChange({ input, event })
							}
							onAccept={() => handleBlur({ input })}
							disablePast
							fullWidth
						/>
						<TimePicker
							label="Select Time"
							value={selectedDate}
							onChange={(event) =>
								handleDateChange({ input, event })
							}
							onAccept={() => handleBlur({ input })}
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
