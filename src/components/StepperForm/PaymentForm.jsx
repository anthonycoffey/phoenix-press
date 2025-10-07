import { useEffect } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const { AUTH_NET_API_LOGIN_ID, AUTH_NET_CLIENT_KEY } = window.LOCALIZED;

export default function PaymentForm({ amount, onTokenReceived, error }) {
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
      cardNumber: document.getElementById('card-number').value,
      month: document.getElementById('card-month').value,
      year: document.getElementById('card-year').value,
      cardCode: document.getElementById('card-cvv').value,
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

  return (
    <Stack spacing={1} sx={{ my: 2 }}>
      <TextField id='card-number' label='Card Number' fullWidth />
      <Stack direction='row' spacing={2}>
        <TextField id='card-month' label='MM' sx={{ width: '50%' }} />
        <TextField id='card-year' label='YYYY' sx={{ width: '50%' }} />
      </Stack>
      <TextField id='card-cvv' label='CVV' fullWidth />
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
