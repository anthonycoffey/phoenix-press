import { useEffect, useState, Suspense } from '@wordpress/element';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CardHeader from '@mui/material/CardHeader';
import Prompt from './Prompt';
import InputField from './InputField';
import Disclaimer from './Disclaimer';
import questionData from '../utils/embed-form-data.js';
import { requiredFields, isSubmissionComplete } from '../utils/validation';
import '../styles.css';

export default function EmbedForm() {
	const [questions] = useState(questionData || false);
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [formSubmissionId, setFormSubmissionId] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [checked, setChecked] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState(null);

	useEffect(() => {
		let id;
		if (window.turnstile) {
			id = window.turnstile.render('#turnstile-widget', {
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
	}, []);

	useEffect(() => {
		if (submitted) {
			const name =
				questions.find((q) => q.name === 'full_name')?.inputs[0]
					?.value || '';
			window.location.href = `/book-success?full_name=${encodeURIComponent(name)}`;
		}
	}, [submitted]);

	const handleSubmit = async () => {
		if ((!turnstileToken && !validPhoneNumber) || loading) return false;
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

			const completed = isSubmissionComplete(submission, requiredFields);

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
							submitted,
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
							submitted,
						}),
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

	const handleTextChange = ({ input, event }) => {
		input.value = event?.target?.value;
	};

	const handleDateChange = ({ input, event }) => {
		input.value = event;
		setSelectedDate(event);
	};

	const handleBlur = () => {
		if (validPhoneNumber && turnstileToken) {
			void handleSubmit();
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
			<Suspense fallback={<LinearProgress />}>
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
									question={{
										prompt: LOCALIZED.SUBMISSION_MESSAGE,
									}}
								/>
							</Stack>
						</CardContent>
					) : (
						<form
							aria-label="Form Description"
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
																	input={
																		input
																	}
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
															setChecked={
																setChecked
															}
															handleBlur={
																handleBlur
															}
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
							</CardContent>

							<CardActions sx={{ justifyContent: 'end' }}>
								<Button
									size={'large'}
									variant="contained"
									color="primary"
									onClick={() => {
										setSubmitted(true);
										handleSubmit();
									}}
									disabled={
										!validPhoneNumber || !turnstileToken
									}
								>
									Submit
								</Button>
							</CardActions>
							{loading || (!turnstileToken && <LinearProgress />)}
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
						</form>
					)}
				</Card>
			</Suspense>
		</section>
	);
}
