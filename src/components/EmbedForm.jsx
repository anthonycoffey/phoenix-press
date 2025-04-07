import { useEffect, useState, useRef, useCallback } from '@wordpress/element';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CardHeader from '@mui/material/CardHeader';
import InputField from './InputField';
import Prompt from './Prompt'; // Added import for success message display
import Disclaimer from './Disclaimer';
import questionData from '../utils/embed-form-data.js';
import { requiredFields, isSubmissionComplete } from '../utils/validation';
import Alert from '@mui/material/Alert';

export default function EmbedForm() {
	const [questions] = useState(questionData || false);
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [checked, setChecked] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState(null);
	const [statusMessage, setStatusMessage] = useState('');
	const [error, setError] = useState('');
	const turnstileRef = useRef(null);
	const blurTimeoutRef = useRef(null);

	useEffect(() => {
		let id;
		if (window?.turnstile && turnstileRef.current) {
			id = window.turnstile.render(turnstileRef.current, {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => {
					setTurnstileToken(token);
					setStatusMessage('');
				},
				'expired-callback': () => {
					window.turnstile.reset(id);
					setStatusMessage('Refreshing security token...');
				},
			});
			setStatusMessage('Securing form, please wait...');
		}
		return () => {
			if (id) {
				window.turnstile.remove(id);
			}
		};
	}, []);

	const handleSubmit = useCallback(
		async (submit = false) => {
			if (loading) return;
			if (!turnstileToken || !validPhoneNumber) {
				setSubmitted(false);
				setStatusMessage('');
				setError('Please provide valid phone number.');
				return false;
			}

			try {
				setError('');
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

				const completed = isSubmissionComplete(
					submission,
					requiredFields
				);

				if (formSubmissionId) {
					await fetch(
						`${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
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
					// GTAG: Trigger form_start on initial submission attempt
					if (typeof window?.dataLayer !== 'undefined') {
						window.dataLayer.push({
							event: 'form_start',
						});
					}
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
						setFormSubmissionId(result?.id);
					}
				}

				// GTAG: Trigger form_submit after successful API call (PUT or POST)
				if (typeof window?.dataLayer !== 'undefined') {
					window.dataLayer.push({
						event: 'form_submit',
						// Optionally add relevant data here if needed
					});
				}

				if (submit) {
					// Removed window.location.assign redirect
					// Success message will be shown via conditional rendering based on 'submitted' state
					setStatusMessage(''); // Clear any intermediate status
				} else {
					setStatusMessage('');
				}
			} catch (error) {
				console.error('There was an error', error);
				setError(
					'There was an error submitting the form. Please try again.'
				);
			} finally {
				setLoading(false);
			}
		},
		[loading, turnstileToken, validPhoneNumber, questions, formSubmissionId]
	);

	const handleTextChange = ({ input, event }) => {
		input.value = event?.target?.value;
	};

	const handleDateChange = ({ input, event }) => {
		input.value = event;
		setSelectedDate(event);
	};

	const handleBlur = () => {
		if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
		blurTimeoutRef.current = setTimeout(() => {
			if (validPhoneNumber && turnstileToken && !submitted) {
				setStatusMessage('Saving your progress, please wait...');
				void handleSubmit();
			}
		}, 30000);
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
				{submitted ? (
					<CardContent>
						<Stack space={2}>
							<Prompt
								question={{ prompt: LOCALIZED.SUBMISSION_MESSAGE }}
							/>
						</Stack>
					</CardContent>
				) : (
					<form aria-label="Booking Form" autoComplete="on" noValidate>
						<CardContent>
							<Stack space={4}>
								{questions?.map((question, index) => (
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
																selectedDate
															}
															setValidPhoneNumber={
																setValidPhoneNumber
															}
															checked={checked}
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
												selectedDate={selectedDate}
												setValidPhoneNumber={
													setValidPhoneNumber
												}
												checked={checked}
												setChecked={setChecked}
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
						{error && (
							<Box sx={{ mt: 2 }}>
								<Alert severity="warning">{error}</Alert>
							</Box>
						)}
					</CardContent>

					<CardActions sx={{ justifyContent: 'end' }}>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ mr: 2 }}
						>
							{statusMessage}
						</Typography>
						<Button
							size={'large'}
							variant="contained"
							color="primary"
							onClick={() => {
								setStatusMessage(
									'Submitting your form, please wait...'
								);
								setSubmitted(true);
								handleSubmit(true);
							}}
							loading={loading || submitted || !turnstileToken}
						>
							Submit
						</Button>
					</CardActions>
					{loading || (!turnstileToken && <LinearProgress />)}
					<div
						ref={turnstileRef}
						id="turnstile-widget"
							className="cf-turnstile"
						></div>
					</form>
				)}
			</Card>
		</section>
	);
}
