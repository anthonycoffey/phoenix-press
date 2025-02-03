import Alert from '@mui/material/Alert';
import parse from 'html-react-parser';

const Disclaimer = ({ index }) => {
	return (
		index === 0 && (
			<>
				{LOCALIZED.DISCLAIMER_MESSAGE && (
					<Alert severity="info" sx={{ padding: '1rem' }}>
						{parse(LOCALIZED.DISCLAIMER_MESSAGE)}
					</Alert>
				)}
			</>
		)
	);
};

export default Disclaimer;
