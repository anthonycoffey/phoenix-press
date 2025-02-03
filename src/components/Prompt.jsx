import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import parse from 'html-react-parser';
import SpeechBubble from './SpeechBubble';

const Prompt = ({ question }) => {
	const assets = LOCALIZED?.ASSETS_URL ?? '';
	return (
		<Stack direction="row" spacing={2} alignItems="flex-start">
			<Avatar src={`${assets}/avatar.jpg`} alt="Technician Avatar" />
			<SpeechBubble>
				<label>{parse(question.prompt)}</label>
			</SpeechBubble>
		</Stack>
	);
};

export default Prompt;
