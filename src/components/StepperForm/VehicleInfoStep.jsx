import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputField from '../InputField';

export default function VehicleInfoStep({
  questions,
  handleTextChange,
  handleDateChange,
  handleConsentChange,
  selectedDate,
  setValidPhoneNumber,
  checked,
  setChecked,
  handleBlur,
  errors,
}) {
  const vehicleQuestions = questions.find((q) =>
    q.inputs.some((i) => i.name === 'car_year')
  );

  return (
    <Box>
      <Typography variant="h6">Vehicle Information</Typography>
      {vehicleQuestions && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mt: '1rem' }}
            color="textSecondary"
          >
            {vehicleQuestions.title}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            sx={{ width: '100%' }}
            gap={2}
          >
            {vehicleQuestions.inputs.map((input, index) => (
              <InputField
                key={index}
                input={input}
                handleTextChange={handleTextChange}
                handleDateChange={handleDateChange}
                handleConsentChange={handleConsentChange}
                selectedDate={selectedDate}
                setValidPhoneNumber={setValidPhoneNumber}
                checked={checked}
                setChecked={setChecked}
                handleBlur={handleBlur}
                error={errors[input.name]}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
