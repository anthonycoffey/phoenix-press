import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import PaymentForm from './PaymentForm';

const PaymentStep = ({
  quoteData,
  onTokenReceived,
  paymentError,
  error,
  payLater,
  onPayLaterChange,
  tip,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
}) => {
  const total = quoteData ? (quoteData.quote + (parseFloat(tip) || 0)) : 0;

  return (
    <Stack spacing={3}>
      {/* Header Section */}
      <Box>
        <CardHeader
          avatar={<CreditCardIcon color='primary' sx={{ fontSize: 30 }} />}
          title={
            <Typography color='primary' component='span' variant='h6' fontWeight="bold">
              {payLater ? "Payment Options" : "Pay with Card"}
            </Typography>
          }
          subheader={!payLater && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Your card is charged only the amount shown—no hidden fees.
            </Typography>
          )}
          sx={{ px: 0, pt: 0, pb: 1 }}
        />

        {/* Payment Form Area */}
        {!payLater ? (
          <Box>
            <PaymentForm
              amount={total}
              onTokenReceived={onTokenReceived}
              error={paymentError}
              cardNumber={cardNumber}
              onCardNumberChange={onCardNumberChange}
              expiry={expiry}
              onExpiryChange={onExpiryChange}
              cvv={cvv}
              onCvvChange={onCvvChange}
            />
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, opacity: 0.7 }}>
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                Visa • Mastercard • Amex • Discover accepted
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Alert severity="info" sx={{ my: 2 }}>
            You have chosen to pay later. Payment will be collected upon completion of the service.
          </Alert>
        )}
      </Box>

      {/* Benefits / Trust Indicators */}
      <Stack spacing={2} sx={{ bgcolor: 'rgba(0,0,0,0.03)', p: 2, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <SecurityIcon color="success" fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            Secure, encrypted payment
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <SpeedIcon color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            Fastest way to get help
          </Typography>
        </Stack>
      </Stack>

      {/* Authorization Microcopy & Pay Later Toggle */}
      <Box textAlign="center">
        <Typography variant='body2' color="text.primary" sx={{ mb: 1, fontWeight: 500 }}>
          {payLater
            ? `Total due upon completion: $${total}`
            : `By continuing, you authorize us to charge your card for $${total}`
          }
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={payLater}
              onChange={(e) => onPayLaterChange(e.target.checked)}
              name='payLater'
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              Pay Later
            </Typography>
          }
        />
      </Box>

      {/* Footer Trust Badge */}
      <Box>
        <Divider sx={{ mb: 1.5 }} />
        <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block' }}>
          Trusted by 100,000+ drivers • 24/7 support • Secure payments
        </Typography>
      </Box>

      {error && <Alert severity='error'>{error}</Alert>}
    </Stack>
  );
};

export default PaymentStep;
