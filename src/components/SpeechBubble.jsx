import { styled } from '@mui/system';
import { CardContent } from '@mui/material';

const SpeechBubble = styled(CardContent)(({ theme }) => ({
	backgroundColor: '#f0f0f0',
	borderRadius: '20px',
	padding: '10px 15px',
	position: 'relative',
	maxWidth: '80%',
}));

export default SpeechBubble;
