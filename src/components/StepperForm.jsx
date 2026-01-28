import { useState, useEffect, useRef } from '@wordpress/element';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

import PhoenixApi from '../utils/PhoenixApi';
import services from '../utils/services.js';

import CustomerInfoStep from './StepperForm/CustomerInfoStep';
import VehicleInfoStep from './StepperForm/VehicleInfoStep';
import QuoteStep from './StepperForm/QuoteStep';
import PaymentStep from './StepperForm/PaymentStep';
import ConfirmationStep from './StepperForm/ConfirmationStep';

const steps = [
  'Service Selection',
  'Vehicle Information',
  'Confirmation',
  'Payment',
];

const leadFormSteps = [
  'Service Selection',
  'Vehicle Information',
  'Confirmation',
];

const initialFormData = {
  full_name: '',
  phone: '',
  email: '',
  service_type: [],
  car_year: '',
  car_make: '',
  car_model: '',
  car_color: '',
  car_license_plate: '',
  additional_info: '',
  location: '',
  service_time: new Date(),
};

export default function StepperForm({ splitTestVariant }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [submissionId, setSubmissionId] = useState(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (splitTestVariant) {
      PhoenixApi.trackSplitTest({
        variant: splitTestVariant,
        event_type: 'view',
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    }
  }, [splitTestVariant]);

  const trackStart = () => {
    if (!hasStartedRef.current && splitTestVariant) {
      PhoenixApi.trackSplitTest({
        variant: splitTestVariant,
        event_type: 'start',
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
      hasStartedRef.current = true;
    }
  };
  const [addressObj, setAddressObj] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [payLater, setPayLater] = useState(false);
  const [opaqueData, setOpaqueData] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [tip, setTip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isPaymentDataValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      expiry.length === 5 &&
      cvv.length >= 3
    );
  };

  const bookingServiceIds = [1, 3, 4, 5];
  const isBookingFlow = formData.service_type.some((s) =>
    bookingServiceIds.includes(s.id)
  );

  const currentSteps = isBookingFlow ? steps : leadFormSteps;

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.location)
        newErrors.location = 'Service Location is required';
      if (!formData.service_time)
        newErrors.service_time = 'Service time is required';
    }
    if (activeStep === 1) {
      if (formData.service_type.length === 0) {
        newErrors.service_type = 'At least one service must be selected';
      }
      if (isBookingFlow) {
        if (!formData.car_year) newErrors.car_year = 'Vehicle year is required';
        if (!formData.car_make) newErrors.car_make = 'Vehicle make is required';
        if (!formData.car_model)
          newErrors.car_model = 'Vehicle model is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveLead = async (submitted = false) => {
    const source =
      window.location.origin.replace(/^https?:\/\//, '') +
      window.location.pathname.replace(/\/$/, '');

    const submission = Object.entries(formData).map(([name, value]) => {
      if (name === 'service_type' && Array.isArray(value)) {
        return {
          name,
          value: value.map(({ id, value }) => ({ id, value })),
        };
      }
      return {
        name,
        value,
      };
    });

    try {
      let currentId = submissionId;
      if (currentId) {
        await PhoenixApi.updateLead(currentId, {
          submission,
          source,
          completed: submitted,
          submitted,
          skipGhlTrigger: isBookingFlow,
        });
      } else {
        const result = await PhoenixApi.submitLead({
          submission,
          source,
          completed: submitted,
          submitted,
          skipGhlTrigger: isBookingFlow,
        });
        if (result && result.id) {
          setSubmissionId(result.id);
          currentId = result.id;
        }
      }
      return currentId;
    } catch (err) {
      console.error('Failed to save lead:', err);
      return submissionId;
    }
  };

  const handleNext = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!validateStep()) return;

    // Save progress on every step transition
    await saveLead(false);

    if (activeStep === currentSteps.length - 1 && isBookingFlow) {
      if (payLater) {
        handleFinalSubmit();
      } else {
        setLoading(true);
        document.getElementById('payment-submit-button').click();
      }
      return;
    }

    if (activeStep === 1 && isBookingFlow) {
      const fetchQuote = async () => {
        setLoading(true);
        setError('');
        try {
          const payload = {
            year: parseInt(formData.car_year, 10),
            make: formData.car_make,
            model: formData.car_model,
            service_ids: formData.service_type?.map((s) => s.id),
            service_time: formData.service_time.toISOString(),
          };
          const quote = await PhoenixApi.getQuote(payload);
          setQuoteData(quote);
          setActiveStep((prev) => prev + 1);
        } catch (err) {
          setError(err.message || 'Failed to fetch quote.');
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
      return;
    }

    if (!isBookingFlow && activeStep === 1) {
      handleFinalSubmit();
    } else if (activeStep === 2 && isBookingFlow) {
      setActiveStep((prev) => prev + 1);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    trackStart();
    const { name, value } = e.target;
    if (name === 'phone') {
      const formattedPhoneNumber = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhoneNumber }));
    } else if (name === 'service_type') {
      const service = services.find((s) => s.id === value);
      setFormData((prev) => {
        const newServices = prev.service_type.some((s) => s.id === service.id)
          ? prev.service_type.filter((s) => s.id !== service.id)
          : [...prev.service_type, service].slice(0, 3);
        return { ...prev, service_type: newServices };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (newValue) => {
    trackStart();
    setFormData((prev) => ({ ...prev, service_time: newValue }));
  };

  const handleLocationGeocoded = (place) => {
    trackStart();
    handlePlaceChanged(place);
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
      setLoading(false);
      setPaymentError(error);
      return;
    }
    setOpaqueData(token);
    handleFinalSubmit(token);
  };

  const handleTipChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setTip(value);
    }
  };

  const handleFinalSubmit = async (token = null) => {
    setLoading(true);
    setError('');
    try {
      // Ensure the lead is saved/updated as submitted
      const finalSubmissionId = await saveLead(true);

      if (isBookingFlow) {
        // Construct line items strictly from breakdown
        const breakdown = quoteData?.breakdown || [];
        const lineItems = [];
        const processedServices = new Set();

        breakdown.forEach((item) => {
          // Check if API provided explicit ServiceId
          let serviceId = item.ServiceId || null;

          if (!serviceId) {
            const label = item.label.toLowerCase();

            if (label.includes('luxury')) {
              serviceId = 79;
            } else if (label.includes('time')) {
              serviceId = 80;
            } else {
              // Try matching with selected services
              const matchedService = formData.service_type.find(
                (s) =>
                  item.label.toLowerCase().includes(s.text.toLowerCase()) ||
                  s.text.toLowerCase().includes(item.label.toLowerCase())
              );

              if (matchedService) {
                serviceId = matchedService.id;
              } else {
                // Try global services list
                const globalService = services.find((s) =>
                  item.label.toLowerCase().includes(s.text.toLowerCase())
                );
                if (globalService) {
                  serviceId = globalService.id;
                }
              }
            }
          }

          if (serviceId) {
            processedServices.add(serviceId);
          }

          lineItems.push({
            ServiceId: serviceId || 35, // Fallback to 'Other' if not found
            description: item.label,
            price: Math.round(item.amount * 100),
          });
        });

        // Calculate residual amount for core services (Total Quote - Breakdown Items)
        const allocatedAmount = lineItems.reduce(
          (sum, item) => sum + item.price,
          0
        );
        const totalQuoteAmount = Math.round((quoteData?.quote || 0) * 100);
        let remainingAmount = totalQuoteAmount - allocatedAmount;

        // Add remaining selected services (if any) with appropriate price
        formData.service_type.forEach((service) => {
          if (!processedServices.has(service.id)) {
            let price = 0;
            // Assign the entire remaining amount to the first remaining service found
            if (remainingAmount > 0) {
              price = remainingAmount;
              remainingAmount = 0;
            }

            lineItems.push({
              ServiceId: service.id,
              description: service.text,
              price: price,
            });
          }
        });

        const payload = {
          customer: {
            firstName: formData.full_name || 'Guest User',
            lastName: '',
            CustomerPhones: [{ number: formData.phone }],
          },
          car: {
            make: formData.car_make,
            model: formData.car_model,
            year: parseInt(formData.car_year, 10),
            color: formData.car_color,
            license_plate: formData.car_license_plate,
          },
          address: addressObj || {},
          locationString: formData.location,
          lineItems,
          opaqueData: token,
          tip: Math.round(tip * 100),
          additional_info: formData.additional_info,
          formSubmissionId: finalSubmissionId,
        };
        await PhoenixApi.createBooking(payload);
      }

      if (splitTestVariant) {
        PhoenixApi.trackSplitTest({
          variant: splitTestVariant,
          event_type: 'submission',
          device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        });
      }

      setActiveStep((prev) => Math.min(prev + 1, currentSteps.length));
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
      handleLocationGeocoded,
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
      cardNumber,
      onCardNumberChange: setCardNumber,
      expiry,
      onExpiryChange: setExpiry,
      cvv,
      onCvvChange: setCvv,
    };

    const stepContentMap = {
      0: <CustomerInfoStep {...stepProps} />,
      1: <VehicleInfoStep {...stepProps} />,
      2: isBookingFlow ? (
        <QuoteStep {...stepProps} />
      ) : (
        <ConfirmationStep {...stepProps} />
      ),
      3: <PaymentStep {...stepProps} />,
    };

    return stepContentMap[step] || <p>Unknown step</p>;
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <CardContent>
          {isMobile ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 0,
              }}
            >
              <Typography variant='overline' sx={{ mb: 1 }}>
                {currentSteps[activeStep]}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {currentSteps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor:
                        index === activeStep ? 'primary.main' : 'grey.500',
                      mx: 0.5,
                      transform: index === activeStep ? 'scale(1.2)' : 'none',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Stepper
              activeStep={activeStep}
              orientation={'horizontal'}
              sx={{
                '& .MuiStepLabel-root .Mui-active': {
                  color: 'primary.main', // circle color
                },
                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                  {
                    color: 'primary.contrastText', // Just text label (ACTIVE)
                  },
                '& .MuiStepLabel-root .Mui-completed': {
                  color: 'secondary.main', // circle color
                },
                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                  {
                    color: 'grey.500', // Just text label (COMPLETED)
                  },
                  mb: 1,
              }}
            >
              {currentSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          {loading && activeStep === 1 && isBookingFlow ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant='h6' sx={{ mt: 2, textAlign: 'center' }}>
                Your quote is being processed, please wait...
              </Typography>
            </Box>
          ) : (
            <Box>
              {activeStep === currentSteps.length ? (
                <ConfirmationStep isBookingFlow={isBookingFlow} />
              ) : (
                getStepContent(activeStep)
              )}
            </Box>
          )}
          {activeStep < currentSteps.length &&
            !(loading && activeStep === 1 && isBookingFlow) && (
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
                  disabled={
                    loading ||
                    (activeStep === currentSteps.length - 1 &&
                      isBookingFlow &&
                      !payLater &&
                      !isPaymentDataValid())
                  }
                >
                  {loading ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : activeStep === currentSteps.length - 1 ? (
                    'Book Now'
                  ) : (
                    'Next'
                  )}
                </Button>
              </Box>
            )}
        </CardContent>
      </Card>
    </ThemeProvider>
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
