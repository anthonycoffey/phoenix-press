import { useState, useEffect } from '@wordpress/element';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MoreTime from '@mui/icons-material/MoreTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditCalendar from '@mui/icons-material/EditCalendar';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import services from '../utils/services.js';
import PhoenixApi from '../utils/PhoenixApi';
import { CardHeader } from '@mui/material';
import AddressAutoComplete from './StepperForm/AddressAutoComplete';
import Disclaimer from './StepperForm/Disclaimer';
import parse from 'html-react-parser';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentForm from './StepperForm/PaymentForm';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const steps = ['Service Selection', 'Vehicle Information', 'Quote', 'Payment'];

const leadFormSteps = [
  'Service Selection',
  'Vehicle Information',
  'Confirmation',
];

const initialFormData = {
  full_name: '',
  phone: '',
  email: '',
  service_type: '',
  car_year: new Date().getFullYear(),
  car_make: '',
  car_model: '',
  car_color: '',
  location: '',
  service_time: new Date(),
};

export default function StepperForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [addressObj, setAddressObj] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [payLater, setPayLater] = useState(false);
  const [opaqueData, setOpaqueData] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [tip, setTip] = useState(0);

  const bookingServiceIds = [1, 3, 4, 5];
  const isBookingFlow = bookingServiceIds.includes(formData.service_type);

  const currentSteps = isBookingFlow ? steps : leadFormSteps;

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.service_type)
        newErrors.service_type = 'Service type is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.service_time)
        newErrors.service_time = 'Service time is required';
    }
    if (activeStep === 1 && isBookingFlow) {
      if (!formData.car_year) newErrors.car_year = 'Vehicle year is required';
      if (!formData.car_make) newErrors.car_make = 'Vehicle make is required';
      if (!formData.car_model)
        newErrors.car_model = 'Vehicle model is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (activeStep === currentSteps.length - 1 && isBookingFlow) {
      if (payLater) {
        handleFinalSubmit();
      } else {
        document.getElementById('payment-submit-button').click();
      }
      return;
    }

    if (activeStep === 1 && isBookingFlow) {
      setLoading(true);
      setError('');
      try {
        const service = services.find((s) => s.id === formData.service_type);
        const payload = {
          year: parseInt(formData.car_year, 10),
          make: formData.car_make,
          model: formData.car_model,
          service_type: service.value,
          service_time: formData.service_time.toISOString(),
        };
        const quote = await PhoenixApi.getQuote(payload);
        setQuoteData(quote);
      } catch (err) {
        setError(err.message || 'Failed to fetch quote.');
      } finally {
        setLoading(false);
      }
    }

    if (!isBookingFlow && activeStep === 1) {
      handleFinalSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const formattedPhoneNumber = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhoneNumber }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, service_time: newValue }));
  };

  const handlePlaceChanged = (place) => {
    if (!place.address_components) {
      return;
    }

    const addressComponents = {
      street_number: '',
      route: '',
      locality: '',
      administrative_area_level_1: '',
      country: '',
      postal_code: '',
    };

    place.address_components.forEach((component) => {
      const type = component.types[0];
      if (addressComponents.hasOwnProperty(type)) {
        addressComponents[type] = component.long_name;
      }
    });

    const newAddressObj = {
      address_1: `${addressComponents.street_number} ${addressComponents.route}`,
      city: addressComponents.locality,
      state: addressComponents.administrative_area_level_1,
      zipcode: addressComponents.postal_code,
    };

    setAddressObj(newAddressObj);
    setFormData((prev) => ({
      ...prev,
      location: place.formatted_address,
    }));
  };

  const handleTokenReceived = (token, error) => {
    if (error) {
      setPaymentError(error);
      return;
    }
    setOpaqueData(token);
    handleFinalSubmit(token);
  };

  const handleTipChange = (e) => {
    const value = parseFloat(e.target.value);
    setTip(isNaN(value) ? 0 : value);
  };

  const handleFinalSubmit = async (token = null) => {
    setLoading(true);
    setError('');
    try {
      if (isBookingFlow) {
        const payload = {
          customer: {
            firstName: formData.full_name,
            lastName: '',
            CustomerPhones: [{ number: formData.phone }],
          },
          car: {
            make: formData.car_make,
            model: formData.car_model,
            year: parseInt(formData.car_year, 10),
            color: formData.car_color,
          },
          address: addressObj || {},
          locationString: formData.location,
          lineItems: quoteData.breakdown.map((item) => ({
            ServiceId: item.id,
            price: Math.round(item.amount * 100),
          })),
          opaqueData: token,
          tip: Math.round(tip * 100),
        };
        await PhoenixApi.createBooking(payload);
      } else {
        const source =
          window.location.origin.replace(/^https?:\/\//, '') +
          window.location.pathname.replace(/\/$/, '');
        await PhoenixApi.submitLead({
          submission: Object.entries(formData).map(([name, value]) => ({
            name,
            value,
          })),
          source,
          completed: true,
          submitted: true,
        });
      }
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    const stepProps = {
      formData,
      handleChange,
      handleDateChange,
      handlePlaceChanged,
      errors,
      quoteData,
      loading,
      error,
      handleFinalSubmit,
      isBookingFlow,
      consent,
      onConsentChange: setConsent,
      payLater,
      onPayLaterChange: setPayLater,
      onTokenReceived: handleTokenReceived,
      paymentError,
      tip,
      onTipChange: handleTipChange,
    };

    const stepContentMap = {
      0: <CustomerInfoStep {...stepProps} />,
      1: <VehicleInfoStep {...stepProps} />,
      2: isBookingFlow ? (
        <QuoteStep {...stepProps} />
      ) : (
        <ConfirmationStep {...stepProps} />
      ),
      3: isBookingFlow ? <PaymentStep {...stepProps} /> : null,
    };

    return stepContentMap[step] || <p>Unknown step</p>;
  };

  return (
    <Card>
      <CardHeader icon={<EditCalendar />} title='Booking Form' />

      <CardContent>
        <Stepper activeStep={activeStep}>
          {currentSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3, mb: 1 }}>
          {activeStep === currentSteps.length ? (
            <ConfirmationStep isBookingFlow={isBookingFlow} />
          ) : (
            getStepContent(activeStep)
          )}
        </Box>
        {activeStep < currentSteps.length && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color='inherit'
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={handleNext}
              variant='contained'
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color='inherit' />
              ) : activeStep === currentSteps.length - 1 ? (
                'Finish'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

const CustomerInfoStep = ({
  formData,
  handleChange,
  handleDateChange,
  handlePlaceChanged,
  errors,
  consent,
  onConsentChange,
}) => (
  <Stack component='form' spacing={3} noValidate autoComplete='off'>
    <TextField
      label='Full Name'
      name='full_name'
      value={formData.full_name}
      onChange={handleChange}
      error={!!errors.full_name}
      helperText={errors.full_name}
      fullWidth
    />
    <TextField
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
    />
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label='Service Time'
        value={formData.service_time}
        onChange={handleDateChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin='normal'
            error={!!errors.service_time}
            helperText={errors.service_time}
          />
        )}
      />
    </LocalizationProvider>
    <TextField
      label='Phone Number'
      name='phone'
      value={formData.phone}
      onChange={handleChange}
      error={!!errors.phone}
      helperText={errors.phone}
      fullWidth
      margin='normal'
    />
    <FormControl fullWidth margin='normal' error={!!errors.service_type}>
      <InputLabel>Service Type</InputLabel>
      <Select
        name='service_type'
        value={formData.service_type}
        onChange={handleChange}
        label='Service Type'
      >
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.text}
          </MenuItem>
        ))}
      </Select>
      {errors.service_type && (
        <Typography color='error' variant='caption'>
          {errors.service_type}
        </Typography>
      )}
    </FormControl>
    <Alert severity='info' sx={{ mb: 2 }}>
      Note: If you require multiple services, please select the primary service
      you require as additional services can be added later.
    </Alert>
    <Disclaimer consent={consent} onConsentChange={onConsentChange} />
  </Stack>
);

const carMakes = [
  'Acura',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Dodge',
  'Fiat',
  'Ford',
  'Genesis',
  'GMC',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Jaguar',
  'Jeep',
  'Kia',
  'Land Rover',
  'Lexus',
  'Lincoln',
  'Maserati',
  'Mazda',
  'Mercedes-Benz',
  'Mini',
  'Mitsubishi',
  'Nissan',
  'Porsche',
  'Ram',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

const VehicleInfoStep = ({ formData, handleChange, errors }) => (
  <Box component='form' noValidate autoComplete='on'>
    <FormControl fullWidth margin='normal' error={!!errors.car_make}>
      <InputLabel>Vehicle Make</InputLabel>
      <Select
        name='car_make'
        value={formData.car_make}
        onChange={handleChange}
        label='Vehicle Make'
      >
        {carMakes.map((make) => (
          <MenuItem key={make} value={make}>
            {make}
          </MenuItem>
        ))}
      </Select>
      {errors.car_make && (
        <Typography color='error' variant='caption'>
          {errors.car_make}
        </Typography>
      )}
    </FormControl>
    <TextField
      label='Vehicle Model'
      name='car_model'
      value={formData.car_model}
      onChange={handleChange}
      error={!!errors.car_model}
      helperText={errors.car_model}
      fullWidth
      margin='normal'
      slotProps={{ htmlInput: { maxLength: 20 } }}
    />
    <TextField
      label='Vehicle Year'
      name='car_year'
      type='number'
      value={formData.car_year}
      onChange={handleChange}
      error={!!errors.car_year}
      helperText={errors.car_year}
      fullWidth
      margin='normal'
      inputProps={{
        min: 1980,
        max: new Date().getFullYear() + 1,
        step: 1,
      }}
    />
    <Alert severity='info' sx={{ mb: 2 }}>
      Please provide your vehicle details to get an accurate quote.
    </Alert>
  </Box>
);

const QuoteStep = ({ formData, quoteData, loading, error }) => (
  <Stack spacing={0}>
    {loading && (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    )}
    {error && <Alert severity='error'>{error}</Alert>}
    {quoteData && (
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        subheader={<ListSubheader>Your Quote Details</ListSubheader>}
      >
        <ListItem>
          <ListItemIcon>
            <DirectionsCarIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${formData.car_make} ${formData.car_model} ${formData.car_year}`}
            secondary={quoteData.vehicle_class}
          />
        </ListItem>
        <Divider component='li' />
        {quoteData.breakdown.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {item.label.includes('surcharge') ? (
                <MoreTime />
              ) : (
                <MonetizationOnIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={`$${item.amount.toFixed(2)}`}
              secondary={item.label}
            />
          </ListItem>
        ))}
        <Divider component='li' />
        <ListItem>
          <ListItemIcon>
            <ReceiptLong size='large' />
          </ListItemIcon>
          <ListItemText
            primary={`$${quoteData.quote.toFixed(2)}`}
            secondary='Total'
          />
        </ListItem>
      </List>
    )}
  </Stack>
);

const PaymentStep = ({
  formData,
  quoteData,
  onTokenReceived,
  paymentError,
  payLater,
  onPayLaterChange,
  tip,
  onTipChange,
}) => (
  <Stack spacing={3}>
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      subheader={<ListSubheader>Order Summary</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <DirectionsCarIcon />
        </ListItemIcon>
        <ListItemText
          primary={`${formData.car_make} ${formData.car_model} ${formData.car_year}`}
          secondary={quoteData.vehicle_class}
        />
      </ListItem>
      <Divider component='li' />
      {quoteData.breakdown.map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            {item.label.includes('surcharge') ? (
              <MoreTime />
            ) : (
              <MonetizationOnIcon />
            )}
          </ListItemIcon>
          <ListItemText
            primary={`$${item.amount.toFixed(2)}`}
            secondary={item.label}
          />
        </ListItem>
      ))}
      <Divider component='li' />
      <ListItem>
        <ListItemIcon>
          <ReceiptLong size='large' />
        </ListItemIcon>
        <ListItemText
          primary={`$${quoteData.quote.toFixed(2)}`}
          secondary='Subtotal'
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <TextField
          label='Tip (optional)'
          type='number'
          value={tip}
          onChange={onTipChange}
          fullWidth
          variant='standard'
        />
      </ListItem>
      <Divider component='li' />
      <ListItem>
        <ListItemIcon>
          <ReceiptLong size='large' />
        </ListItemIcon>
        <ListItemText
          primary={`$${(quoteData.quote + tip).toFixed(2)}`}
          secondary='Total'
        />
      </ListItem>
    </List>
    <CardHeader
      avatar={<CreditCardIcon color='primary' />}
      title='Pay with Card'
    />
    {!payLater && (
      <PaymentForm
        amount={quoteData.quote + tip}
        onTokenReceived={onTokenReceived}
        error={paymentError}
      />
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

const ConfirmationStep = ({ isBookingFlow }) => {
  const { SUBMISSION_MESSAGE } = window.LOCALIZED;
  const defaultMessage = isBookingFlow
    ? 'Your booking has been confirmed.'
    : `Thank you for reaching out! Don't wait — call us now at <a href="tel:+18665848488">(866) 584-8488</a> to speak with a live dispatcher and get help right away!`;
  const message = SUBMISSION_MESSAGE || defaultMessage;

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
      <Typography variant='h4' gutterBottom>
        Thank You!
      </Typography>
      <Typography variant='body1'>{parse(message)}</Typography>
    </Paper>
  );
};
