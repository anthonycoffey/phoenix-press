import React, { useEffect, lazy, Suspense } from 'react';
import { TextField, FormControlLabel, Checkbox, Stack } from '@mui/material';
import {
	DatePicker,
	TimePicker,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import parse from 'html-react-parser';

const PhoneField = lazy(() => import('./EmbedForm/PhoneField'));
const AddressAutoComplete = lazy(
	() => import('./EmbedForm/AddressAutoComplete')
);
const Services = lazy(() => import('./EmbedForm/Services'));

const InputField = ({
	input,
	handleTextChange,
	handleDateChange,
	handleConsentChange,
	selectedDate,
	setValidPhoneNumber,
	checked,
	handleBlur,
}) => {
	useEffect(() => {
		if (input.type === 'datetime') {
			handleDateChange({ input, event: selectedDate });
		}
	}, []);
	switch (input.type) {
		case 'tel':
			return (
				<PhoneField
					input={input}
					setValidPhoneNumber={setValidPhoneNumber}
					handleBlur={handleBlur}
				/>
			);
		case 'text':
			return (
				<TextField
					label={input.label}
					name={input.name}
					onChange={(event) => handleTextChange({ input, event })}
					onBlur={handleBlur}
					fullWidth
					variant="outlined"
					margin="normal"
					required={!input.optional}
				/>
			);
		case 'geo':
			return (
				<AddressAutoComplete input={input} handleBlur={handleBlur} />
			);
		case 'select':
			return <Services input={input} handleBlur={handleBlur} />;
		case 'checkbox':
			return (
				<FormControlLabel
					sx={{ marginBottom: '1rem' }}
					control={
						<Checkbox
							checked={checked}
							onChange={(event) =>
								handleConsentChange({ input, event })
							}
							onBlur={handleBlur}
							name={input.name}
							required={!input.optional}
						/>
					}
					label={parse(LOCALIZED.SMS_CONSENT_MESSAGE || input.label)}
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
							onAccept={handleBlur}
							disablePast
							fullWidth
						/>
						<TimePicker
							label="Select Time"
							value={selectedDate}
							onChange={(event) =>
								handleDateChange({ input, event })
							}
							onAccept={handleBlur}
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
