import { useContext, useEffect, useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
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
import { Switch } from '@mui/material';

const Answer = ({ question }) => {
	const { errors, setErrors } = useContext(GlobalStateContext);
	const { questions, setQuestions, currentQuestionIndex } =
		useContext(GlobalStateContext);
	const [selectedDate, setSelectedDate] = useState(new Date());

	useEffect(() => {
		if (questions) {
			const updatedQuestions = [...questions];
			const currentInput = updatedQuestions[
				currentQuestionIndex
			].inputs.find((input) => input.name === 'service_time');
			if (currentInput) {
				currentInput.value = selectedDate;
				setQuestions(updatedQuestions);
			}
		}
	}, [question, selectedDate]);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleInputChange = (event) => {
		const { name, value, type, checked } = event.target;
		const updatedQuestions = [...questions];
		const currentInput = updatedQuestions[currentQuestionIndex].inputs.find(
			(input) => input.name === name
		);
		currentInput.value = type === 'checkbox' ? checked : value;
		setQuestions(updatedQuestions);

		if (currentInput.type === 'text' || currentInput.type === 'checkbox') {
			// Validate text input
			const errorMessage = validateField(currentInput);
			setErrors({ ...errors, [currentInput.name]: errorMessage });
		}
	};

	const validateField = (input) => {
		if (!input.optional) {
			switch (input.type) {
				case 'text':
					return !input.value.trim() ? 'This field is required' : '';
				case 'checkbox':
					return !input.value ? 'This field is required' : '';
				default:
					return '';
			}
		}
		return '';
	};

	return (
		<>
			{question.inputs.map((input, index) => {
				if (input.type === 'tel') {
					return (
						<PhoneField
							input={input}
							key={index}
							onChange={handleInputChange}
						/>
					);
				}

				if (input.type === 'text') {
					return (
						<TextField
							key={index}
							label={input.label}
							name={input.name}
							value={input.value}
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
				}

				if (input.type === 'geo') {
					return <AddressAutoComplete input={input} key={index} />;
				}

				if (input.type === 'select') {
					return <ServiceSelect input={input} key={index} />;
				}

				if (input.type === 'textarea') {
					return (
						<TextField
							key={index}
							label={input.label}
							name={input.name}
							value={input.value}
							onChange={handleInputChange}
							fullWidth
							required={!input.optional}
							variant="outlined"
							margin="normal"
							size="small"
						/>
					);
				}

				if (input.type === 'checkbox') {
					return (
						<FormControlLabel
							key={index}
							control={
								<Switch
									checked={input.value}
									onChange={handleInputChange}
									name={input.name}
									required={!input.optional}
								/>
							}
							disableTypography={true}
							className="phoenix-conversational-form__consent-switch"
							label={parse(
								LOCALIZED.SMS_CONTENT_MESSAGE || input.label
							)}
						/>
					);
				}

				if (input.type === 'datetime') {
					return (
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							key={index}
						>
							<Stack
								direction="row"
								spacing={2}
								sx={{ marginTop: '1rem' }}
							>
								<DatePicker
									label="Select Date"
									value={selectedDate}
									onChange={handleDateChange}
									disablePast
									fullWidth
								/>
								<TimePicker
									label="Select Time"
									value={selectedDate}
									onChange={handleDateChange}
									fullWidth
								/>
							</Stack>
						</LocalizationProvider>
					);
				}

				return null;
			})}
		</>
	);
};

export default Answer;
