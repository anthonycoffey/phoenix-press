import { useState } from '@wordpress/element';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputField from '../InputField';

export default function PaymentStep({ quoteData, handleFinalSubmit }) {
  const [showCardForm, setShowCardForm] = useState(false);

  const handlePayNow = () => {
    setShowCardForm(true);
  };

  const handlePayLater = () => {
    handleFinalSubmit();
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const opaqueData = {
      dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT',
      dataValue: 'mock-payment-token',
    };
    handleFinalSubmit(opaqueData);
  };

  return (
    <Box>
      <Typography variant="h6">Payment</Typography>
      <Typography variant="h5">
        Total: ${quoteData ? quoteData.quote / 100 : '...'}
      </Typography>

      {!showCardForm && (
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handlePayNow}>
            Pay Now
          </Button>
          <Button variant="outlined" onClick={handlePayLater}>
            Pay Later
          </Button>
        </Stack>
      )}

      {showCardForm && (
        <Box component="form" onSubmit={handleCardSubmit}>
          <Stack spacing={2}>
            <Typography variant="subtitle1">Enter Card Details</Typography>
            {/* This is a placeholder for the real Authorize.Net form */}
            <InputField
              input={{
                name: 'card_number',
                type: 'text',
                label: 'Card Number',
              }}
              handleTextChange={() => {}}
            />
            <InputField
              input={{
                name: 'expiry_date',
                type: 'text',
                label: 'Expiration Date',
              }}
              handleTextChange={() => {}}
            />
            <InputField
              input={{
                name: 'cvv',
                type: 'text',
                label: 'CVV',
              }}
              handleTextChange={() => {}}
            />
            <Button type="submit" variant="contained">
              Submit Payment
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
