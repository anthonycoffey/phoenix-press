import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import parse from 'html-react-parser';
import SpeechBubble from './SpeechBubble';

// Wrap component in React.memo
// Accept 'questionPrompt' prop instead of 'question' object
const Prompt = ({ questionPrompt }) => {
	const assets = LOCALIZED?.ASSETS_URL ?? '';
	// Handle case where prompt might be undefined initially
	const promptText = questionPrompt || '';
	// Log the incoming prop
	console.log('Received questionPrompt:', questionPrompt);
	return (
		<Stack direction="row" spacing={2} alignItems="flex-start">
			<Avatar src={`${assets}/avatar.jpg`} alt="Technician Avatar" />
			<SpeechBubble>
				<label>{parse(promptText)}</label>
			</SpeechBubble>
		</Stack>
	);
}; // Close React.memo

export default Prompt;
