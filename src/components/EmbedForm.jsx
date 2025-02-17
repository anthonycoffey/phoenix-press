import React, { useEffect, useState, useRef } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardActions,
	Stack,
	Typography,
	LinearProgress,
	CardHeader,
	Alert,
} from '@mui/material';
import InputField from './InputField';
import Disclaimer from './Disclaimer';
import questionData from '../utils/embed-form-data.js';
import { requiredFields, isSubmissionComplete } from '../utils/validation';

export default function EmbedForm() {
	const [formState, setFormState] = useState({
		questions: questionData || [],
		validPhoneNumber: false,
		loading: false,
		submitted: false,
		formSubmissionId: null,
		selectedDate: new Date(),
		checked: false,
		turnstileToken: null,
		error: '',
	});

	const turnstileRef = useRef(null);

	useEffect(() => {
		let id;
		if (window?.turnstile && turnstileRef.current) {
			id = window.turnstile.render(turnstileRef.current, {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => {
					setFormState((prevState) => ({
						...prevState,
						turnstileToken: token,
					}));
				},
				'expired-callback': () => {
					window.turnstile.reset(id);
				},
			});
		}
		return () => {
			if (id) {
				window.turnstile.remove(id);
			}
		};
	}, []);

	const handleSubmit = async (submit = false) => {
		if (!formState.validPhoneNumber) {
			setFormState((prevState) => ({
				...prevState,
				error: 'Phone number is required.',
				submitted: submit ? false : prevState.submitted,
			}));
			return false;
		}
		if (submit) {
			setFormState((prevState) => ({ ...prevState, submitted: true }));
		}
		try {
			setFormState((prevState) => ({ ...prevState, loading: true }));
			const submission = formState.questions.flatMap((question) =>
				question.inputs.map((input) => {
					const { name, value, obj } = input;
					return obj ? { name, value, obj } : { name, value };
				})
			);

			const headers = {
				'Content-Type': 'application/json',
				'X-Turnstile-Token': formState.turnstileToken,
			};

			const source =
				window.location.origin.replace(/^https?:\/\//, '') +
				window.location.pathname.replace(/\/$/, '');

			const completed = isSubmissionComplete(submission, requiredFields);

			if (formState.formSubmissionId) {
				await fetch(
					`${LOCALIZED.API_URL}/submit-lead-form/${formState.formSubmissionId}`,
					{
						method: 'PUT',
						headers,
						body: JSON.stringify({
							submission,
							source,
							completed,
							submitted: submit,
						}),
					}
				);
			} else {
				const response = await fetch(
					`${LOCALIZED.API_URL}/submit-lead-form`,
					{
						method: 'POST',
						headers,
						body: JSON.stringify({
							submission,
							source,
							completed,
							submitted: submit,
						}),
					}
				);

				const result = await response.json();
				if (result?.id) {
					setFormState((prevState) => ({
						...prevState,
						formSubmissionId: result.id,
					}));
				}
			}

			if (submit) {
				const name =
					formState.questions.find((q) => q.name === 'full_name')
						?.inputs[0]?.value || '';
				window.location.assign(
					`/book-success?full_name=${encodeURIComponent(name)}`
				);
			}
		} catch (error) {
			console.error('There was an error', error);
		} finally {
			setFormState((prevState) => ({ ...prevState, loading: false }));
		}
	};

	const handleTextChange = ({ input, event }) => {
		input.value = event?.target?.value;
	};

	const handleDateChange = ({ input, event }) => {
		input.value = event;
		setFormState((prevState) => ({ ...prevState, selectedDate: event }));
	};

	const handleBlur = () => {
		if (
			formState.validPhoneNumber &&
			formState.turnstileToken &&
			!formState.loading
		) {
			void handleSubmit();
		}
	};

	const handleConsentChange = ({ input, event }) => {
		const { checked } = event?.target;
		input.value = checked;
		setFormState((prevState) => ({ ...prevState, checked }));
		handleBlur();
	};

	return (
		<section>
			<Card className="phoenix-form">
				{LOCALIZED.FORM_TITLE && (
					<CardHeader
						title={LOCALIZED.FORM_TITLE}
						subheader={LOCALIZED.FORM_SUBTITLE}
					/>
				)}
				<form aria-label="Booking Form" autoComplete="on" noValidate>
					<CardContent>
						<Stack space={4}>
							{formState.questions?.map((question, index) => (
								<React.Fragment key={index}>
									{question.type === 'row' ? (
										<>
											<Typography
												variant="subtitle1"
												sx={{ mt: '1rem' }}
												color="textSecondary"
											>
												{question.title}
												<Typography
													variant="subtitle2"
													color="textSecondary"
												>
													{question.label}
												</Typography>
											</Typography>
											<Box
												display="flex"
												flexDirection="row"
												sx={{ width: '100%' }}
												gap={2}
											>
												{question.inputs.map(
													(input, index) => (
														<InputField
															key={index}
															input={input}
															handleTextChange={
																handleTextChange
															}
															handleDateChange={
																handleDateChange
															}
															handleConsentChange={
																handleConsentChange
															}
															selectedDate={
																formState.selectedDate
															}
															setValidPhoneNumber={(
																valid
															) =>
																setFormState(
																	(
																		prevState
																	) => ({
																		...prevState,
																		validPhoneNumber:
																			valid,
																	})
																)
															}
															checked={
																formState.checked
															}
															setChecked={(
																checked
															) =>
																setFormState(
																	(
																		prevState
																	) => ({
																		...prevState,
																		checked,
																	})
																)
															}
															handleBlur={
																handleBlur
															}
														/>
													)
												)}
											</Box>
										</>
									) : (
										question.inputs.map((input, index) => (
											<InputField
												key={index}
												input={input}
												handleTextChange={
													handleTextChange
												}
												handleDateChange={
													handleDateChange
												}
												handleConsentChange={
													handleConsentChange
												}
												selectedDate={
													formState.selectedDate
												}
												setValidPhoneNumber={(valid) =>
													setFormState(
														(prevState) => ({
															...prevState,
															validPhoneNumber:
																valid,
														})
													)
												}
												checked={formState.checked}
												setChecked={(checked) =>
													setFormState(
														(prevState) => ({
															...prevState,
															checked,
														})
													)
												}
												handleBlur={handleBlur}
											/>
										))
									)}
								</React.Fragment>
							))}
						</Stack>
						<Box>
							<Disclaimer index={0} />
						</Box>
						{formState.error && (
							<Box sx={{ mt: 2 }}>
								<Alert severity="warning">
									{formState.error}
								</Alert>
							</Box>
						)}
					</CardContent>

					<CardActions sx={{ justifyContent: 'end' }}>
						<Box>
							{formState.loading && !formState.submitted && (
								<Typography>Autosaving...</Typography>
							)}
							{formState.loading && formState.submitted && (
								<Typography>Submitting...</Typography>
							)}
						</Box>
						<Button
							size={'large'}
							variant="contained"
							color="primary"
							onClick={() => {
								void handleSubmit(true);
							}}
							loading={formState.submitted}
						>
							Submit
						</Button>
					</CardActions>
					{formState.loading ||
						(!formState.turnstileToken && <LinearProgress />)}
					<div
						ref={turnstileRef}
						id="turnstile-widget"
						className="cf-turnstile"
					></div>
				</form>
			</Card>
		</section>
	);
}
