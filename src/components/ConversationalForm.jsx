import {
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from '@wordpress/element';
import Typography from '@mui/material/Typography'; // Import Typography
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

	// === Local State Management for Form ===
	// Initialize questions, setting default for datetime if needed
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
	// =======================================

	// Restore Turnstile state and ref
	const turnstileRef = useRef(null);
	const [turnstileToken, setTurnstileToken] = useState(null);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const gtagUserDataSentRef = useRef(false);

	// --- Derived State (using local state now) ---
	const currentQuestion = useMemo(
		() => questions[currentQuestionIndex],
		[questions, currentQuestionIndex]
	);

	// Memo to check only for input errors, ignoring loading/turnstile for button disabling
	const hasInputErrors = useMemo(() => {
		if (!currentQuestion || !currentQuestion.inputs) return true; // Treat no inputs as an error state for disabling
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
	// --- End Derived State ---

	// --- Effects ---
	// Restore Turnstile useEffect
	useEffect(() => {
		let id;
		if (isFormVisible && window?.turnstile && turnstileRef.current) {
			id = window.turnstile.render(turnstileRef.current, {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => setTurnstileToken(token),
				'expired-callback': () => {
					// Reset token and potentially the widget if needed
					setTurnstileToken(null);
					if (id) window.turnstile.reset(id);
				},
			});
		}
		return () => {
			// Cleanup Turnstile widget on unmount or when form is hidden
			if (id && window?.turnstile) {
				try {
					window.turnstile.remove(id);
				} catch (e) {
					console.error('Error removing Turnstile widget:', e);
				}
			}
		};
	}, [isFormVisible]); // Rerun when form visibility changes

	// Reset errors when question changes
	useEffect(() => {
		setErrors({});
	}, [currentQuestionIndex]);

	// Validation Effect - Runs when currentQuestion data changes
	useEffect(() => {
		if (!currentQuestion || !currentQuestion.inputs) {
			return; // No question or inputs to validate
		}

		let errorsChanged = false;
		const nextErrors = { ...errors }; // Start with current errors

		currentQuestion.inputs.forEach((input) => {
			const newErrorMessage = validateInputObject(input); // Validate current input state
			const currentErrorMessage = errors[input.name];

			if (currentErrorMessage !== newErrorMessage) {
				errorsChanged = true;
				if (newErrorMessage) {
					nextErrors[input.name] = newErrorMessage;
				} else {
					// Only delete if the key actually exists
					if (input.name in nextErrors) {
						delete nextErrors[input.name];
					}
				}
			}
		});

		// Only call setErrors if the error state actually needs to change
		if (errorsChanged) {
			setErrors(nextErrors);
		}
		// DO NOT add 'errors' to dependency array here, causes infinite loop!
	}, [currentQuestion, setErrors]); // Rerun validation when the current question object changes

	// --- End Effects ---

	// --- Callbacks & Handlers ---
	const toggleFormVisibility = useCallback(() => {
		setIsFormVisible(!isFormVisible);
	}, [isFormVisible, setIsFormVisible]);

	const source = useMemo(
		() =>
			window.location.origin.replace(/^https?:\/\//, '') +
			window.location.pathname.replace(/\/$/, ''),
		[]
	);

	// Restore turnstileToken to headers
	const headers = useMemo(
		() => ({
			'Content-Type': 'application/json',
			'X-Turnstile-Token': turnstileToken,
		}),
		[turnstileToken]
	);

	const completeSubmission = useCallback(async () => {
    // Import formatPhoneNumber function

    const submission = questions.flatMap((q) =>
      q.inputs.map(({ name, value, obj }) => {
        // Apply formatPhoneNumber only to phone fields
        const formattedValue = name === 'phone' ? formatPhoneNumber(value) : value;
        return obj ? { name, value: formattedValue, obj } : { name, value: formattedValue };
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
			// GTAG logic...
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
			if (typeof window?.dataLayer !== 'undefined') {
				window.dataLayer.push({ event: 'form_submit' });
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
		// Restore turnstileToken check
		if ((loading && !formSubmissionId) || !turnstileToken) return false;
		const submission = questions.flatMap((q) =>
			q.inputs.map(({ name, value, obj }) =>
				obj ? { name, value, obj } : { name, value }
			)
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
					if (typeof window?.dataLayer !== 'undefined')
						window.dataLayer.push({ event: 'form_start' });
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
	]); // Restore turnstileToken dependency

	// Input Handler - Only updates questions state
	const handleAnswerInputChange = useCallback(
		(name, value) => {
			setQuestions((prevQuestions) => {
				const questionToUpdate = prevQuestions[currentQuestionIndex];
				if (!questionToUpdate) return prevQuestions;
				const inputIndex = questionToUpdate.inputs.findIndex(
					(input) => input.name === name
				);
				if (inputIndex === -1) return prevQuestions;
				const currentInput = questionToUpdate.inputs[inputIndex];

				if (currentInput.value === value) return prevQuestions; // No change

				// Value changed
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
			// Validation handled by useEffect
		},
		[currentQuestionIndex, setQuestions]
	); // Only depends on index and setter

	// Date Handler - Only updates questions state
	const handleAnswerDateChange = useCallback(
		(name, date) => {
			const newValue = date instanceof Date ? date.toISOString() : date;
			setQuestions((prevQuestions) => {
				const questionToUpdate = prevQuestions[currentQuestionIndex];
				if (!questionToUpdate) return prevQuestions;
				const inputIndex = questionToUpdate.inputs.findIndex(
					(input) => input.name === name
				);
				if (inputIndex === -1) return prevQuestions;
				const currentInput = questionToUpdate.inputs[inputIndex];

				if (currentInput.value === newValue) return prevQuestions; // No change

				// Value changed
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
			// Validation/error clearing handled by useEffect
		},
		[currentQuestionIndex, setQuestions]
	); // Only depends on index and setter

	const handleBackClick = useCallback(() => {
		// Simplified: Always allow back navigation immediately
		setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
	}, [setCurrentQuestionIndex]); // Only depends on setter

	const handleNextSubmitClick = useCallback(() => {
		// Prevent action if loading, turnstile not ready, or errors exist
		if (loading || !turnstileToken || hasInputErrors) {
			return;
		}
		// Proceed with submission
		handleSubmit();
	}, [loading, turnstileToken, hasInputErrors, handleSubmit]); // Keep dependencies
	// --- End Callbacks & Handlers ---

	// --- Render Logic ---
	if (!questions || questions.length === 0) return null;

	return (
		<section>
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
						width: 'max-content', // Shrink-wrap content
						minWidth: '300px', // Minimum width
						maxWidth: '500px', // Maximum width
						marginLeft: 'auto', // Align to the right within the fixed parent
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
							{/* Submitted state message */}
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
										{/* Pass granular props */}
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
											services={services} // Pass services data down
										/>
									</Stack>
									{/* Navigation Area */}
									<Stack
										direction="row"
										spacing={1} // Reduced spacing slightly
										sx={{
											width: '100%',
											display: 'flex',
											my: '1rem',
											justifyContent:
												currentQuestionIndex > 0
													? 'space-between'
													: 'flex-end', // Keep alignment logic
											alignItems: 'center', // Vertically align items
										}}
									>
										{currentQuestionIndex > 0 && (
											<Button
												variant="contained"
												onClick={handleBackClick}
												// Back button is never disabled by loading/turnstile
											>
												Back
											</Button>
										)}
										{/* Spacer to push button/text to the right if Back is hidden */}
										{currentQuestionIndex === 0 && <Box sx={{ flexGrow: 1 }} />}

										{/* Inline Status Text */}
										<Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
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
											disabled={hasInputErrors || loading || !turnstileToken} // Updated disabled logic
										>
											{currentQuestionIndex + 1 === questions.length
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
								)}{' '}
								{/* Restore check */}
							</Box>
						</form>
					</CardContent>
					{/* Restore Turnstile widget div */}
					<div
						ref={turnstileRef}
						id="conversation-turnstile-widget"
						className="cf-turnstile"
					></div>
				</Card>
			)}
		</section>
	);
};

export default ConversationalForm;
