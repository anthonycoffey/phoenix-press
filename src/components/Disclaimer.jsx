import { memo } from '@wordpress/element'; // Import memo
import Alert from '@mui/material/Alert';
import parse from 'html-react-parser';

// Wrap component in React.memo
const Disclaimer = memo(({ index }) => {
	// The component only depends on the 'index' prop and global LOCALIZED.
	// If LOCALIZED is stable, memoization will prevent re-renders unless index changes.
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
}); // Close React.memo

export default Disclaimer;
