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
	const [isDirty, setIsDirty] = useState(false); // Track if form data has changed
	const turnstileRef = useRef(null);
	const debounceTimeoutRef = useRef(null); // For debouncing saves
	const gtagUserDataSentRef = useRef(false); // Track if gtag user_data has been set for this instance

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

				// GTAG: Set user data for enhanced conversions
				const emailEntry = submission.find(
					(item) => item.name === 'email'
				);
				const phoneEntry = submission.find(
					(item) => item.name === 'phone'
				);
				const userData = {};
				if (emailEntry?.value) {
					userData.email = emailEntry.value;
				}
				if (phoneEntry?.value) {
					// Basic E.164 formatting attempt
					let phoneNumber = phoneEntry.value.replace(/[^0-9+]/g, '');
					if (
						phoneNumber.length === 10 &&
						!phoneNumber.startsWith('+')
					) {
						phoneNumber = '+1' + phoneNumber;
					}
					userData.phone_number = phoneNumber;
				}

				// Set user data only once per component instance when email is present
				if (
					!gtagUserDataSentRef.current &&
					typeof window?.gtag !== 'undefined' &&
					userData.email
				) {
					window.gtag('set', 'user_data', userData);
					gtagUserDataSentRef.current = true; // Mark as sent for this instance
				}

				// GTAG: Trigger form_submit ONLY on final, explicit submission
				if (submit && typeof window?.dataLayer !== 'undefined') {
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
				// Reset dirty state only on successful save (auto or final)
				if (!error) {
					// Check if there was an error before resetting
					setIsDirty(false);
				}
			}
		},
		[
			loading,
			turnstileToken,
			validPhoneNumber,
			questions,
			formSubmissionId,
			error,
		] // Added error dependency
	);

	// Debounced auto-save function
	const debouncedAutoSave = useCallback(() => {
		// Clear any existing debounce timeout
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		// Set a new timeout
		debounceTimeoutRef.current = setTimeout(() => {
			// Check conditions *inside* the timeout callback
			if (
				isDirty &&
				validPhoneNumber &&
				turnstileToken &&
				!submitted &&
				!loading
			) {
				setStatusMessage('Auto-saving...');
				void handleSubmit(false); // Call auto-save
			}
		}, 2500); // 2.5 second debounce delay
	}, [
		isDirty,
		validPhoneNumber,
		turnstileToken,
		submitted,
		loading,
		handleSubmit,
		setStatusMessage,
	]);

	const handleTextChange = useCallback(
		({ input, event }) => {
			const newValue = event?.target?.value;
			if (input.value !== newValue) {
				input.value = newValue;
				setIsDirty(true);
				debouncedAutoSave(); // Trigger debounce on change
			}
		},
		[debouncedAutoSave]
	); // Depends on debouncedAutoSave

	const handleDateChange = useCallback(
		({ input, event }) => {
			if (input.value !== event) {
				input.value = event;
				setSelectedDate(event);
				setIsDirty(true);
				debouncedAutoSave(); // Trigger debounce on change
			}
		},
		[setSelectedDate, debouncedAutoSave] // Depends on setSelectedDate and debouncedAutoSave
	);

	// handleBlur is kept for potential future validation logic, but no longer triggers save
	const handleBlur = useCallback(() => {
		// Clear the blur-specific timeout if it was ever used (it's not now)
		// if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
		// No longer triggers auto-save
	}, []); // No dependencies needed currently

	const handleConsentChange = useCallback(
		({ input, event }) => {
			const isChecked = event?.target?.checked;
			if (input.value !== isChecked) {
				input.value = isChecked;
				setChecked(isChecked);
				setIsDirty(true);
				debouncedAutoSave(); // Trigger debounce on change
			}
		},
		[setChecked, debouncedAutoSave] // Depends on setChecked and debouncedAutoSave
	);

	// Extracted submit button click handler
	const handleFinalSubmit = useCallback(() => {
		setStatusMessage('Submitting your form, please wait...');
		setSubmitted(true);
		// Call the main handleSubmit logic with submit=true
		handleSubmit(true);
	}, [setStatusMessage, setSubmitted, handleSubmit]); // Depends on setters and the main submit handler

	return (
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
								questionPrompt={LOCALIZED.SUBMISSION_MESSAGE}
							/>
						</Stack>
					</CardContent>
				) : (
					<form
						aria-label="Booking Form"
						autoComplete="on"
						noValidate
					>
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
										) : (
											question.inputs.map(
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
														setChecked={setChecked}
														handleBlur={handleBlur}
													/>
												)
											)
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
								onClick={handleFinalSubmit} // Use the memoized handler
								disabled={
									loading || submitted || !turnstileToken
								} // Use disabled prop for clarity
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
	);
}
