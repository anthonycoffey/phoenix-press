import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EventAvailable from '@mui/icons-material/EventAvailable';
import parse from 'html-react-parser';

const ConfirmationStep = ({ isBookingFlow }) => {
  const { SUBMISSION_MESSAGE } = window.LOCALIZED || {};
  const defaultMessage = `Thank you for reaching out! Don't wait — call us now at <a href="tel:+18665848488">(866) 584-8488</a> to speak with a live dispatcher and get help right away!`;
  const message = SUBMISSION_MESSAGE || defaultMessage;

  return (
    <Box
      elevation={0}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <EventAvailable sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
      <Typography variant='h4' gutterBottom>
        {isBookingFlow ? 'Booking Confirmed!' : 'Submission Successful!'}
      </Typography>
      <Typography variant='body1'>{parse(message)}</Typography>
    </Box>
  );
};

export default ConfirmationStep;
