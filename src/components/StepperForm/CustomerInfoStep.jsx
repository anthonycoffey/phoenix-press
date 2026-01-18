import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import en from 'date-fns/locale/en-US';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddressAutoComplete from './AddressAutoComplete';
import Disclaimer from './Disclaimer';

const CustomerInfoStep = ({
  formData,
  handleChange,
  handleDateChange,
  handlePlaceChanged,
  handleLocationGeocoded,
  errors,
  consent,
  onConsentChange,
}) => (
  <>
    <CardHeader
      title={
        <Typography
          color='primary'
          component='span'
          variant='h6'
        >
          Customer Information
        </Typography>
      }
      avatar={<AccountCircle color='primary' />}
      sx={{fontSize: '0.6rem', whiteSpace: 'nowrap' }}
    />
    <Stack component='form' spacing={2} noValidate autoComplete='on'>
      <TextField
        variant='filled'
        label='Full Name'
        name='full_name'
        value={formData.full_name}
        onChange={handleChange}
        error={!!errors.full_name}
        helperText={errors.full_name}
        fullWidth
      />
      <TextField
        variant='filled'
        label='Email Address (optional)'
        name='email'
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />
      <AddressAutoComplete
        value={formData.location}
        onChange={handleChange}
        onPlaceChanged={handlePlaceChanged}
        error={!!errors.location}
        helperText={errors.location}
        onLocationGeocoded={handleLocationGeocoded}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={en}>
        <DateTimePicker
          label='Service Time'
          value={formData.service_time}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              variant: 'filled',
              fullWidth: true,
              margin: 'normal',
              error: !!errors.service_time,
              helperText: errors.service_time,
            },
          }}
        />
      </LocalizationProvider>
      <TextField
        variant='filled'
        label='Phone Number'
        name='phone'
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        fullWidth
        margin='normal'
      />
      <Disclaimer consent={consent} onConsentChange={onConsentChange} />
    </Stack>
  </>
);

export default CustomerInfoStep;
