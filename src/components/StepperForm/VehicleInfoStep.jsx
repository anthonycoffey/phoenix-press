import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import ContactSupport from '@mui/icons-material/ContactSupport';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import VehicleSelector from './VehicleSelector';
import ServiceCarousel from './ServiceCarousel';
import services from '../../utils/services.js';

const VehicleInfoStep = ({ formData, handleChange, errors }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1948 }, (_, i) =>
    (currentYear  - i).toString(),
  );

  return (
    <>
      <CardHeader
        title={
          <Typography color='primary' component='span' variant='h6'>
            What are you driving?
          </Typography>
        }
        avatar={<DirectionsCar fontSize='large' color='primary' />}
        sx={{ px: 0 }}
      />
      <Stack component='form' spacing={2} noValidate autoComplete='on'>
        <VehicleSelector
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
        <Autocomplete
          options={years}
          value={formData.car_year.toString()}
          onChange={(event, value) =>
            handleChange({ target: { name: 'car_year', value } })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant='filled'
              label='Vehicle Year'
              error={!!errors.car_year}
              helperText={errors.car_year}
              margin='none'
              fullWidth
            />
          )}
        />

        <CardHeader
          title={
            <Typography color='primary' component='span' variant='h6'>
              How can we help you?
            </Typography>
          }
          subheader={
            'Select a service below, bundling services unlocks super savings!'
          }
          avatar={<ContactSupport fontSize='large' color='primary' />}
          sx={{ px: 0 }}
        />

        <ServiceCarousel
          services={services}
          selectedServices={formData.service_type}
          onServiceSelect={(service) =>
            handleChange({
              target: { name: 'service_type', value: service.id },
            })
          }
        />
        {errors.service_type && (
          <Typography color='error' variant='caption'>
            {errors.service_type}
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default VehicleInfoStep;
