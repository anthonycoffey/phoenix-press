import {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from '@wordpress/element';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import Prompt from './Prompt';
import Answer from './Answer';
import Disclaimer from './Disclaimer';
import CancelIcon from './CancelIcon';
import { GlobalStateContext } from '../state';
import { validateInputObject, formatPhoneNumber } from '../utils/validation';

const ConversationalForm = () => {
	// Get only global state/setters from context
	const {
		loading,
		setLoading,
		submitted,
		setSubmitted,
		isFormVisible,
		setIsFormVisible,
		initialQuestions, // Get initial questions data
		services, // Get services data from context
	} = useContext(GlobalStateContext);

	const [questions, setQuestions] = useState(() => {
		const processedQuestions = initialQuestions
			? JSON.parse(JSON.stringify(initialQuestions))
			: []; // Deep copy to avoid mutating original
		processedQuestions.forEach((q) => {
			q.inputs.forEach((input) => {
				if (input.type === 'datetime' && !input.value) {
					input.value = new Date().toISOString(); // Set default to NOW if no value exists
				}
			});
		});
		return processedQuestions;
	});
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [errors, setErrors] = useState({});
	const [isDirty, setIsDirty] = useState(false);

	const turnstileRef = useRef(null);
	const [turnstileToken, setTurnstileToken] = useState(null);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const gtagUserDataSentRef = useRef(false);
	const formStartFiredRef = useRef(false);
	const formSubmitFiredRef = useRef(false);

	const currentQuestion = useMemo(
		() => questions[currentQuestionIndex],
		[questions, currentQuestionIndex]
	);

	const hasInputErrors = useMemo(() => {
		if (!currentQuestion || !currentQuestion.inputs) return true;
		return currentQuestion.inputs.some((input) => !!errors[input.name]);
	}, [currentQuestion, errors]);

	const currentErrors = useMemo(() => {
		if (!currentQuestion || !currentQuestion.inputs) return {};
		const relevantErrors = {};
		currentQuestion.inputs.forEach((input) => {
			if (errors[input.name]) {
				relevantErrors[input.name] = errors[input.name];
			}
		});
		return relevantErrors;
	}, [currentQuestion, errors]);

	useEffect(() => {
		let id;
		if (isFormVisible && window?.turnstile && turnstileRef.current) {
			id = window.turnstile.render(turnstileRef.current, {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => setTurnstileToken(token),
				'expired-callback': () => {
					setTurnstileToken(null);
					if (id) window.turnstile.reset(id);
				},
			});
		}
		return () => {
			if (id && window?.turnstile) {
				try {
					window.turnstile.remove(id);
				} catch (e) {
					console.error('Error removing Turnstile widget:', e);
				}
			}
		};
	}, [isFormVisible]);

	useEffect(() => {
		setErrors({});
	}, [currentQuestionIndex]);

	// Track first interaction to trigger form_start
	useEffect(() => {
		if (
			isDirty &&
			!formStartFiredRef.current &&
			typeof window?.gtag !== 'undefined'
		) {
			window.gtag('event', 'form_start');
			formStartFiredRef.current = true;
		}
	}, [isDirty]);

	// Track first successful save to trigger form_submit
	useEffect(() => {
		if (
			formSubmissionId &&
			!formSubmitFiredRef.current &&
			typeof window?.gtag !== 'undefined'
		) {
			window.gtag('event', 'form_submit');
			formSubmitFiredRef.current = true;
		}
	}, [formSubmissionId]);

	useEffect(() => {
		if (!currentQuestion || !currentQuestion.inputs) {
			return;
		}

		let errorsChanged = false;
		const nextErrors = { ...errors };

		currentQuestion.inputs.forEach((input) => {
			const newErrorMessage = validateInputObject(input);
			const currentErrorMessage = errors[input.name];

			if (currentErrorMessage !== newErrorMessage) {
				errorsChanged = true;
				if (newErrorMessage) {
					nextErrors[input.name] = newErrorMessage;
				} else {
					if (input.name in nextErrors) {
						delete nextErrors[input.name];
					}
				}
			}
		});

		if (errorsChanged) {
			setErrors(nextErrors);
		}
	}, [currentQuestion, setErrors]);

	const toggleFormVisibility = useCallback(() => {
		setIsFormVisible(!isFormVisible);
	}, [isFormVisible, setIsFormVisible]);

	const source = useMemo(
		() =>
			window.location.origin.replace(/^https?:\/\//, '') +
			window.location.pathname.replace(/\/$/, ''),
		[]
	);

	const headers = useMemo(
		() => ({
			'Content-Type': 'application/json',
			'X-Turnstile-Token': turnstileToken,
		}),
		[turnstileToken]
	);

	const completeSubmission = useCallback(async () => {
		const submission = questions.flatMap((q) =>
			q.inputs.map(({ name, value, obj }) => {
				const formattedValue =
					name === 'phone' ? formatPhoneNumber(value) : value;
				return obj
					? { name, value: formattedValue, obj }
					: { name, value: formattedValue };
			})
		);
		try {
			setLoading(true);

			if (!formSubmissionId) {
				return false;
			}
			await fetch(
				`${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
				{
					method: 'PUT',
					headers,
					body: JSON.stringify({
						submission,
						completed: true,
						submitted: true,
						source,
					}),
				}
			);

			const emailEntry = submission.find((item) => item.name === 'email');
			const phoneEntry = submission.find((item) => item.name === 'phone');
			const userData = {};
			if (emailEntry?.value) userData.email = emailEntry.value;
			if (phoneEntry?.value) {
				let phoneNumber = phoneEntry.value.replace(/[^0-9+]/g, '');
				if (phoneNumber.length === 10 && !phoneNumber.startsWith('+'))
					phoneNumber = '+1' + phoneNumber;
				userData.phone_number = phoneNumber;
			}
			if (
				!gtagUserDataSentRef.current &&
				typeof window?.gtag !== 'undefined' &&
				userData.email
			) {
				window.gtag('set', 'user_data', userData);
				gtagUserDataSentRef.current = true;
			}
		} catch (error) {
			setSubmitted(false);
			console.log(error);
		} finally {
			setSubmitted(true);
			setLoading(false);
		}
	}, [
		questions,
		formSubmissionId,
		headers,
		source,
		setLoading,
		setSubmitted,
	]);

	const handleSubmit = useCallback(async () => {
		if ((loading && !formSubmissionId) || !turnstileToken) return false;
		const submission = questions.flatMap((q) =>
			q.inputs.map(({ name, value, obj }) => {
				const formattedValue =
					name === 'phone' ? formatPhoneNumber(value) : value;
				return obj
					? { name, value: formattedValue, obj }
					: { name, value: formattedValue };
			})
		);
		try {
			setLoading(true);
			if (currentQuestionIndex + 1 === questions.length) {
				await completeSubmission();
			} else {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				if (formSubmissionId) {
					await fetch(
						`${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
						{
							method: 'PUT',
							headers,
							body: JSON.stringify({ submission, source }),
						}
					);
				} else {
					const response = await fetch(
						`${LOCALIZED.API_URL}/submit-lead-form`,
						{
							method: 'POST',
							headers,
							body: JSON.stringify({ submission, source }),
						}
					);
					const result = await response.json();
					if (result?.id) setFormSubmissionId(result.id);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [
		loading,
		turnstileToken,
		questions,
		currentQuestionIndex,
		formSubmissionId,
		headers,
		source,
		setLoading,
		setCurrentQuestionIndex,
		setFormSubmissionId,
		completeSubmission,
	]);

	const handleAnswerInputChange = useCallback(
		(name, value) => {
			setIsDirty(true);
			setQuestions((prevQuestions) => {
				const questionToUpdate = prevQuestions[currentQuestionIndex];
				if (!questionToUpdate) return prevQuestions;
				const inputIndex = questionToUpdate.inputs.findIndex(
					(input) => input.name === name
				);
				if (inputIndex === -1) return prevQuestions;
				const currentInput = questionToUpdate.inputs[inputIndex];

				if (currentInput.value === value) return prevQuestions;

				const updatedInput = { ...currentInput, value };
				const updatedInputs = [...questionToUpdate.inputs];
				updatedInputs[inputIndex] = updatedInput;
				const updatedQuestions = [...prevQuestions];
				updatedQuestions[currentQuestionIndex] = {
					...questionToUpdate,
					inputs: updatedInputs,
				};
				return updatedQuestions;
			});
		},
		[currentQuestionIndex, setQuestions]
	);

	const handleAnswerDateChange = useCallback(
		(name, date) => {
			setIsDirty(true);
			const newValue = date instanceof Date ? date.toISOString() : date;
			setQuestions((prevQuestions) => {
				const questionToUpdate = prevQuestions[currentQuestionIndex];
				if (!questionToUpdate) return prevQuestions;
				const inputIndex = questionToUpdate.inputs.findIndex(
					(input) => input.name === name
				);
				if (inputIndex === -1) return prevQuestions;
				const currentInput = questionToUpdate.inputs[inputIndex];

				if (currentInput.value === newValue) return prevQuestions;

				const updatedInput = { ...currentInput, value: newValue };
				const updatedInputs = [...questionToUpdate.inputs];
				updatedInputs[inputIndex] = updatedInput;
				const updatedQuestions = [...prevQuestions];
				updatedQuestions[currentQuestionIndex] = {
					...questionToUpdate,
					inputs: updatedInputs,
				};
				return updatedQuestions;
			});
		},
		[currentQuestionIndex, setQuestions]
	);

	const handleBackClick = useCallback(() => {
		setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
	}, [setCurrentQuestionIndex]);

	const handleNextSubmitClick = useCallback(() => {
		if (loading || !turnstileToken || hasInputErrors) {
			return;
		}
		handleSubmit();
	}, [loading, turnstileToken, hasInputErrors, handleSubmit]);

	if (!questions || questions.length === 0) return null;

	return (
		<>
			{/* Button to show form */}
			{!isFormVisible && (
				<button
					onClick={toggleFormVisibility}
					id="phoenix-show-form-button"
					aria-label="Show Lead Form"
					style={{
						background: !LOCALIZED.CHAT_AVATAR ? '#4395ce' : 'none',
					}}
				>
					{LOCALIZED.CHAT_AVATAR ? (
						<img
							className="phoenix-chat-avatar"
							src={LOCALIZED.CHAT_AVATAR}
							alt="Phoenix Lead Form Chat Avatar"
						/>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="e-font-icon-svg e-fas-comment-alt"
							viewBox="0 0 512 512"
							width="24"
							height="24"
							fill="#fff"
						>
							<path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z" />
						</svg>
					)}
				</button>
			)}

			{/* Form Card */}
			{isFormVisible && (
				<Card
					className="phoenix-form"
					sx={{
						width: '100%',
						maxWidth: '500px',
						marginLeft: 'auto',
					}}
				>
					<CardHeader
						id="phoenix-chat-form-header"
						action={
							<Button
								onClick={toggleFormVisibility}
								aria-label="close"
							>
								<CancelIcon />
							</Button>
						}
					/>
					<CardContent sx={{ paddingBottom: 0 }}>
						<form
							aria-label="Booking Form"
							autoComplete="on"
							noValidate
						>
							{submitted && (
								<Prompt
									questionPrompt={
										LOCALIZED.SUBMISSION_MESSAGE
									}
								/>
							)}

							{/* Main form content */}
							{!submitted && (
								<>
									<Stack spacing={2}>
										<Prompt
											questionPrompt={
												currentQuestion?.prompt
											}
										/>
										<Answer
											questionInputs={
												currentQuestion?.inputs
											}
											errors={currentErrors}
											onInputChange={
												handleAnswerInputChange
											}
											onDateChange={
												handleAnswerDateChange
											}
											services={services}
										/>
									</Stack>
									{/* Navigation Area */}
									<Stack
										direction="row"
										spacing={1}
										sx={{
											width: '100%',
											display: 'flex',
											my: '1rem',
											justifyContent:
												currentQuestionIndex > 0
													? 'space-between'
													: 'flex-end',
											alignItems: 'center',
										}}
									>
										{currentQuestionIndex > 0 && (
											<Button
												variant="contained"
												onClick={handleBackClick}
											>
												Back
											</Button>
										)}
										{/* Spacer to push button/text to the right if Back is hidden */}
										{currentQuestionIndex === 0 && (
											<Box sx={{ flexGrow: 1 }} />
										)}

										<Typography
											variant="caption"
											sx={{
												color: 'text.secondary',
												mr: 1,
											}}
										>
											{loading
												? 'Saving your answer, please wait...'
												: !turnstileToken
													? 'Securing form, please wait...'
													: ''}
										</Typography>

										{/* Next/Submit Button */}
										<Button
											variant="contained"
											color="primary"
											onClick={handleNextSubmitClick}
											disabled={
												hasInputErrors ||
												loading ||
												!turnstileToken
											} // Updated disabled logic
										>
											{currentQuestionIndex + 1 ===
											questions.length
												? 'Submit'
												: 'Next'}
										</Button>
									</Stack>
									<Disclaimer index={currentQuestionIndex} />
								</>
							)}
							{/* Loading indicator */}
							<Box
								spacing={2}
								className={'phoenix-no-select'}
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									minHeight: '10px',
								}}
							>
								{(loading || !turnstileToken) && (
									<LinearProgress sx={{ width: '100%' }} />
								)}
							</Box>
						</form>
					</CardContent>
					<div
						ref={turnstileRef}
						id="conversation-turnstile-widget"
						className="cf-turnstile"
					></div>
				</Card>
			)}
		</>
	);
};

export default ConversationalForm;
