import { useEffect, useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const {
  AUTH_NET_API_LOGIN_ID,
  AUTH_NET_CLIENT_KEY,
  AUTH_NET_TEST_MODE,
} = window.LOCALIZED;

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
    script.src = AUTH_NET_TEST_MODE
      ? 'https://jstest.authorize.net/v1/Accept.js'
      : 'https://js.authorize.net/v1/Accept.js';
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
    <Card
      sx={{
        my: 2,
        p: 2,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3a3a3a 0%, #1e1e1e 100%)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: '50px',
            height: '40px',
            background: '#007aff',
            borderRadius: '4px',
            mb: 2,
          }}
        />
        <TextField
          id='card-number'
          label='Card Number'
          value={cardNumber}
          onChange={handleCardNumberChange}
          fullWidth
          variant='filled'
          InputLabelProps={{
            sx: { color: 'rgba(255, 255, 255, 0.7)' },
          }}
          inputProps={{
            sx: { color: 'white', fontSize: '1.2rem' },
          }}
        />
        <Stack direction='row' spacing={2} sx={{ mt: 2 }}>
          <TextField
            id='card-expiry'
            label='MM/YY'
            value={expiry}
            onChange={handleExpiryChange}
            sx={{ width: '50%' }}
            variant='filled'
            InputLabelProps={{
              sx: { color: 'rgba(255, 255, 255, 0.7)' },
            }}
            inputProps={{
              sx: { color: 'white' },
            }}
          />
          <TextField
            id='card-cvv'
            label='CVV'
            value={cvv}
            variant='filled'
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 4) {
                onCvvChange(value);
              }
            }}
            sx={{ width: '50%' }}
            InputLabelProps={{
              sx: { color: 'rgba(255, 255, 255, 0.7)' },
            }}
            inputProps={{
              sx: { color: 'white' },
            }}
          />
        </Stack>
        {error && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          onClick={sendPaymentDataToAnet}
          variant='contained'
          sx={{ display: 'none' }}
          id='payment-submit-button'
        >
          Submit Payment
        </Button>
      </CardContent>
    </Card>
  );
}
