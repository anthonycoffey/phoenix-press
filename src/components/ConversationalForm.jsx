import { useContext, useEffect, useRef, useState } from '@wordpress/element';
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

const ConversationalForm = () => {
	const {
		questions,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		submitted,
		setSubmitted,
		loading,
		setLoading,
		isFormVisible,
		setIsFormVisible,
		errors,
	} = useContext(GlobalStateContext);
	const turnstileRef = useRef(null);
	const currentQuestion = questions[currentQuestionIndex];
	const [invalid, setInvalid] = useState(true);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const [turnstileToken, setTurnstileToken] = useState(null);

	useEffect(() => {
		const hasErrors = currentQuestion.inputs.some(
			(input) => errors[input.name]
		);
		setInvalid(hasErrors);

		return () => {
			setInvalid(true);
		};
	}, [errors]);

	useEffect(() => {
		let id;
		if (isFormVisible && window?.turnstile && turnstileRef.current) {
			id = window.turnstile.render(turnstileRef.current, {
				sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
				callback: (token) => {
					setTurnstileToken(token);
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
	}, [isFormVisible]);

	const toggleFormVisibility = () => {
		setIsFormVisible(!isFormVisible);
	};

	const handleSubmit = async () => {
		if (loading || !turnstileToken) return false;
		try {
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

			if (currentQuestionIndex + 1 === questions.length) {
				return await completeSubmission(submission, source);
			} else {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			}

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
				if (result?.id) {
					setFormSubmissionId(result?.id);
				}
			}
		} catch (error) {
			console.error('There was an error', error);
		} finally {
			setLoading(false);
		}
	};

	const completeSubmission = async (submission, source) => {
		try {
			setLoading(true);
			setSubmitted(true);
			if (!formSubmissionId) return false;

			await fetch(
				`${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'X-Turnstile-Token': turnstileToken,
					},
					body: JSON.stringify({
						submission,
						completed: true,
						submitted: true,
						source,
					}),
				}
			);

			const name =
				questions.find((q) => q.name === 'full_name')?.inputs[0]
					?.value || '';
			window.location.assign(
				`/book-success?full_name=${encodeURIComponent(name)}`
			);
		} catch (error) {
			console.error('There was an error', error);
		}
	};

	return (
		<section>
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

			{isFormVisible && (
				<Card className="phoenix-form">
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
									question={{
										prompt: 'Saving your submission, please wait...',
									}}
								/>
							)}
							{!submitted && (
								<>
									<Stack space={2}>
										<Prompt question={currentQuestion} />
										<Answer question={currentQuestion} />
									</Stack>
									{!loading && (
										<Stack
											direction="row"
											spacing={2}
											sx={{
												width: '100%',
												display: 'flex',
												my: '1rem',
												justifyContent:
													currentQuestionIndex > 0
														? 'space-between'
														: 'flex-end',
											}}
										>
											{currentQuestionIndex > 0 && (
												<Button
													variant="contained"
													onClick={() =>
														setCurrentQuestionIndex(
															currentQuestionIndex -
																1
														)
													}
												>
													Back
												</Button>
											)}

											<Button
												sx={{ justifySelf: 'end' }}
												variant="contained"
												color="primary"
												onClick={() => {
													handleSubmit();
												}}
												disabled={invalid}
												loading={
													loading || !turnstileToken
												}
											>
												{currentQuestionIndex + 1 ===
												questions.length
													? 'Submit'
													: 'Next'}
											</Button>
										</Stack>
									)}
									<Disclaimer index={currentQuestionIndex} />
								</>
							)}
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
		</section>
	);
};

export default ConversationalForm;
