import React, { useContext, useState, useEffect, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
	Button,
	Card,
	CardContent,
	Stack,
	CircularProgress,
	CardHeader,
} from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';
import Prompt from './components/Prompt';
import Answer from './components/Answer';
import Disclaimer from './components/Disclaimer';
import { GlobalStateContext, GlobalStateProvider } from './state.js';
import './styles.sass';

const EmbedForm = lazy(() => import('./components/EmbedForm'));

const PhoenixForm = () => {
	const {
		questions,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		loading,
		setLoading,
		submitted,
		setSubmitted,
		isFormVisible,
		setIsFormVisible,
		errors,
	} = useContext(GlobalStateContext);

	const currentQuestion = questions[currentQuestionIndex];

	const [invalid, setInvalid] = useState(true);
	const [formStarted, setFormStarted] = useState(false);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const [turnstileToken, setTurnstileToken] = useState(null);

	useEffect(() => {
		const hasErrors = currentQuestion.inputs.some(
			(input) => errors[input.name]
		);

		setInvalid(hasErrors);
	}, [errors]);

	useEffect(() => {
		if (isFormVisible && window.turnstile) {
			const id = window.turnstile.render(
				'#conversation-turnstile-widget',
				{
					sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
					callback: (token) => {
						setTurnstileToken(token);
					},
					'expired-callback': () => {
						window.turnstile.reset(id);
					},
				}
			);
		}
	}, [isFormVisible]);

	const toggleFormVisibility = () => {
		setIsFormVisible(!isFormVisible);
	};

	const handleSubmit = async () => {
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

		if (!formStarted) {
			setFormStarted(true);
			if (window?.dataLayer) {
				window.dataLayer.push({
					event: 'form_start',
				});
			}
		}

		try {
			if (!turnstileToken) {
				return false;
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
			if (formSubmissionId) {
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
							source,
						}),
					}
				);
			}

			if (window?.dataLayer) {
				window.dataLayer.push({
					event: 'form_submit',
					submission,
					source,
					completed: true,
				});
			}
		} catch (error) {
			console.error('There was an error', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section>
			<button
				onClick={toggleFormVisibility}
				id="phoenix-show-form-button"
				aria-label="Show Lead Form"
			>
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
			</button>

			{isFormVisible && (
				<Card className="phoenix-form">
					<CardHeader
						action={
							<Button
								onClick={toggleFormVisibility}
								aria-label="close"
							>
								<Cancel />
							</Button>
						}
					/>

					<>
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
							<>
								<CardContent>
									<Stack space={2}>
										<Prompt question={currentQuestion} />
										<Answer question={currentQuestion} />
									</Stack>
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
												loading={loading}
												onClick={() =>
													setCurrentQuestionIndex(
														currentQuestionIndex - 1
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
											disabled={
												invalid ||
												!turnstileToken ||
												submitted
											}
										>
											{currentQuestionIndex + 1 ===
											questions.length
												? 'Submit'
												: 'Next'}
										</Button>
									</Stack>

									<Stack
										direction="row"
										spacing={2}
										sx={{
											width: '100%',
											display: 'flex',
											my: '1rem',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<>
											{loading ||
												(!turnstileToken && (
													<CircularProgress />
												))}
										</>
									</Stack>

									<Disclaimer index={currentQuestionIndex} />
								</CardContent>
							</>
						)}
					</>

					<div
						id="conversation-turnstile-widget"
						className="cf-turnstile"
						style={{
							display: 'flex',
							justifyContent: 'center',
							margin: '1rem 0',
							padding: '1rem',
						}}
						data-sitekey={LOCALIZED.TURNSTILE_SITE_KEY}
					></div>
				</Card>
			)}
		</section>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const chat = document.getElementById('phoenix-form-root');
	if (chat) {
		const root = createRoot(chat);
		root.render(
			<GlobalStateProvider>
				<PhoenixForm />
			</GlobalStateProvider>
		);
	}

	const roots = document.querySelectorAll('.phoenix-form-embed-root');
	roots.forEach((el) => {
		createRoot(el).render(
			<Suspense fallback={<CircularProgress />}>
				<EmbedForm />
			</Suspense>
		);
	});
});
