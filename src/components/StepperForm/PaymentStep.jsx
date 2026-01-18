import React from 'react';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PaymentForm from './PaymentForm';

const PaymentStep = ({
  quoteData,
  onTokenReceived,
  paymentError,
  payLater,
  onPayLaterChange,
  tip,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
}) => (
  <Stack spacing={2}>
    {!payLater && quoteData && (
      <>
        <CardHeader
          avatar={<CreditCardIcon color='primary' />}
          title={
            <Typography color='primary' component='span' variant='h6'>
              Pay with Card
            </Typography>
          }
          sx={{ px: 0, pt: 0 }}
        />
        <PaymentForm
          amount={quoteData.quote + (parseFloat(tip) || 0)}
          onTokenReceived={onTokenReceived}
          error={paymentError}
          cardNumber={cardNumber}
          onCardNumberChange={onCardNumberChange}
          expiry={expiry}
          onExpiryChange={onExpiryChange}
          cvv={cvv}
          onCvvChange={onCvvChange}
        />
      </>
    )}
    <FormControlLabel
      control={
        <Checkbox
          checked={payLater}
          onChange={(e) => onPayLaterChange(e.target.checked)}
          name='payLater'
        />
      }
      label='Pay Later'
    />
  </Stack>
);

export default PaymentStep;
