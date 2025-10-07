import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import parse from 'html-react-parser';

const { DISCLAIMER_MESSAGE } = window.LOCALIZED;

const defaultMessage =
  'By checking this box, you agree to receive text messages from our company. Message and data rates may apply.';

export default function Disclaimer({ consent, onConsentChange }) {
  const message = DISCLAIMER_MESSAGE || defaultMessage;

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            name='consent'
            color='primary'
          />
        }
        label={
          <Typography variant='body2' color='textSecondary'>
            {parse(message)}
          </Typography>
        }
      />
    </Box>
  );
}
