import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputField from '../InputField';
import { Alert } from '@mui/material';

export default function CustomerInfoStep({
  questions,
  handleTextChange,
  handleDateChange,
  handleConsentChange,
  selectedDate,
  setValidPhoneNumber,
  checked,
  setChecked,
  handleBlur,
  handleServiceChange,
  errors,
}) {
  const customerInfoQuestions = questions.filter(
    (q) =>
      q.inputs.some((i) => i.name === 'full_name') ||
      q.inputs.some((i) => i.name === 'phone') ||
      q.inputs.some((i) => i.name === 'email')
  );

  const serviceQuestion = questions.find((q) => q.name === 'service_type');

  return (
    <Box>
      <Typography variant="h6">Customer Information</Typography>
      {customerInfoQuestions.map((question, index) => (
        <React.Fragment key={index}>
          {question.inputs.map((input, index) => (
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
        </React.Fragment>
      ))}
      {serviceQuestion && (
        <><InputField
          input={serviceQuestion.inputs[0]}
          handleServiceChange={handleServiceChange}
          handleDateChange={() => {}}
          handleConsentChange={() => {}}
          selectedDate={selectedDate}
          setValidPhoneNumber={setValidPhoneNumber}
          checked={checked}
          setChecked={setChecked}
          handleBlur={handleBlur}
          error={errors[serviceQuestion.inputs[0].name]}
        />
        <Alert severity="info" sx={{ mt: 2 }}>
    Please note: We can offer more than one service. If you need multiple services, please select the most relevant one and provide details in the comments section.
  </Alert>
        </>
      )}
    </Box>
  );
}
