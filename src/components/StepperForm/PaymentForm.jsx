import { useEffect, useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const { AUTH_NET_API_LOGIN_ID, AUTH_NET_CLIENT_KEY } = window.LOCALIZED;

export default function PaymentForm({
  amount,
  onTokenReceived,
  error,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
}) {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.authorize.net/v1/Accept.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const sendPaymentDataToAnet = () => {
    const authData = {
      clientKey: AUTH_NET_CLIENT_KEY,
      apiLoginID: AUTH_NET_API_LOGIN_ID,
    };

    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      month: expiry.split('/')[0],
      year: `20${expiry.split('/')[1]}`,
      cardCode: cvv,
    };

    const secureData = {
      authData: authData,
      cardData: cardData,
    };

    window.Accept.dispatchData(secureData, (response) => {
      if (response.messages.resultCode === 'Error') {
        const errors = response.messages.message;
        let errorMessage = '';
        for (let i = 0; i < errors.length; i++) {
          errorMessage += errors[i].text + '\n';
        }
        onTokenReceived(null, errorMessage);
      } else {
        onTokenReceived(response.opaqueData, null);
      }
    });
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length <= 19) {
      onCardNumberChange(formattedValue);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (value.length <= 5) {
      onExpiryChange(value);
    }
  };

  return (
    <Stack spacing={1} sx={{ my: 2 }}>
      <TextField
        id='card-number'
        label='Card Number'
        value={cardNumber}
        onChange={handleCardNumberChange}
        fullWidth
      />
      <Stack direction='row' spacing={2}>
        <TextField
          id='card-expiry'
          label='MM/YY'
          value={expiry}
          onChange={handleExpiryChange}
          sx={{ width: '50%' }}
        />
        <TextField
          id='card-cvv'
          label='CVV'
          value={cvv}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 4) {
              onCvvChange(value);
            }
          }}
          sx={{ width: '50%' }}
        />
      </Stack>
      {error && <Alert severity='error'>{error}</Alert>}
      <Button
        onClick={sendPaymentDataToAnet}
        variant='contained'
        sx={{ display: 'none' }}
        id='payment-submit-button'
      >
        Submit Payment
      </Button>
    </Stack>
  );
}
