import CardContent from '@mui/material/CardContent';
const SpeechBubble = (props) => (
	<CardContent
		sx={{
			backgroundColor: '#f0f0f0',
			borderRadius: '20px',
			padding: '10px 15px',
			position: 'relative',
			maxWidth: '80%',
		}}
		{...props}
	/>
);

export default SpeechBubble;
