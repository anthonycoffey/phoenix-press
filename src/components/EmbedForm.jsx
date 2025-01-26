import React, { useEffect, useState, lazy, Suspense } from 'react';
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
} from '@mui/material';
import questionData from '../utils/embed-form-data';
import '../styles.sass';
import { requiredFields, isSubmissionComplete } from '../utils/validation';

// Lazy load components
const Prompt = lazy(() => import('./Prompt'));
const InputField = lazy(() => import('./InputField'));
const Disclaimer = lazy(() => import('./Disclaimer'));

export default function EmbedForm() {
	const [questions] = useState(questionData || false);
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [formStarted, setFormStarted] = useState(false);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [checked, setChecked] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState(null);

	useEffect(() => {
		if (window.turnstile) {
			const id = window.turnstile.render('#turnstile-widget', {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => {
					setTurnstileToken(token);
				},
				'expired-callback': () => {
					window.turnstile.reset(id);
				},
			});
		}
	}, []);

	const handleSubmit = async (submit = false) => {
		if (!turnstileToken && !validPhoneNumber) return false;

		setLoading(true);
		const submission = questions.flatMap((question) =>
			question.inputs.map((input) => {
				const { name, value, obj } = input;
				return obj ? { name, value, obj } : { name, value };
			})
		);

		const headers = {
			'Content-Type': 'application/json',
			'X-Turnstile-Token': turnstileToken,
		};

		const source =
			window.location.origin.replace(/^https?:\/\//, '') +
			window.location.pathname.replace(/\/$/, '');

		if (!turnstileToken) return false;

		try {
			const completed = isSubmissionComplete(submission, requiredFields);

			if (formSubmissionId) {
				await fetch(
					`${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
					{
						method: 'PUT',
						headers,
						body: JSON.stringify({ submission, source, completed }),
					}
				);
			} else {
				if (!formStarted) {
					setFormStarted(true);
					if (window?.dataLayer) {
						window.dataLayer.push({
							event: 'form_start',
						});
					}
				}

				const response = await fetch(
					`${LOCALIZED.API_URL}/submit-lead-form`,
					{
						method: 'POST',
						headers,
						body: JSON.stringify({ submission, source, completed }),
					}
				);

				const result = await response.json();
				if (result?.id) {
					setFormSubmissionId(result?.id);
				}
			}

			if (submit) {
				setSubmitted(true);
			}
		} catch (error) {
			console.error('There was an error', error);
		} finally {
			setLoading(false);
		}
	};

	const handleTextChange = ({ input, event }) => {
		input.value = event?.target?.value;
	};

	const handleDateChange = ({ input, event }) => {
		input.value = event;
		setSelectedDate(event);
	};

	const handleBlur = (submit = false) => {
		if (!loading && validPhoneNumber && turnstileToken) {
			void handleSubmit(submit);
		} else {
			return false;
		}
	};

	const handleConsentChange = ({ input, event }) => {
		const { checked } = event?.target;
		input.value = checked;
		setChecked(checked);
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
				{submitted && (
					<CardContent>
						<Stack space={2}>
							<Prompt
								question={{
									prompt: LOCALIZED.SUBMISSION_MESSAGE,
								}}
							/>
						</Stack>
					</CardContent>
				)}

				{!submitted && (
					<form
						aria-label="Form Description"
						autoComplete="on"
						noValidate
					>
						<CardContent>
							<Stack space={4}>
								{questions?.map((question, index) => {
									if (question.type === 'row') {
										return (
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
													key={index}
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
																	selectedDate
																}
																setValidPhoneNumber={
																	setValidPhoneNumber
																}
																checked={
																	checked
																}
																setChecked={
																	setChecked
																}
																handleBlur={
																	handleBlur
																}
															/>
														)
													)}
												</Box>
											</>
										);
									} else {
										return question.inputs.map(
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
													selectedDate={selectedDate}
													setValidPhoneNumber={
														setValidPhoneNumber
													}
													checked={checked}
													setChecked={setChecked}
													handleBlur={handleBlur}
												/>
											)
										);
									}
								})}
							</Stack>
							<Box>
								<Disclaimer index={0} />
							</Box>
							<div
								id="turnstile-widget"
								className="cf-turnstile"
								style={{
									display: 'flex',
									justifyContent: 'center',
									margin: '1rem 0',
									padding: '1rem',
								}}
								data-sitekey={LOCALIZED.TURNSTILE_SITE_KEY}
							></div>
							<>{loading && <LinearProgress />}</>
						</CardContent>

						<CardActions sx={{ justifyContent: 'end' }}>
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									void handleBlur(true);
								}}
								disabled={
									loading ||
									!validPhoneNumber ||
									!turnstileToken
								}
							>
								Submit
							</Button>
						</CardActions>
					</form>
				)}
			</Card>
		</section>
	);
}
