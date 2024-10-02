import React, { useContext } from 'react';
import { TextField, Stack } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { GlobalStateContext } from '../state';
import AddressAutoComplete from './AddressAutoComplete';
import ServiceSelect from './ServiceSelect';
import PhoneField from './PhoneField';

const Answer = ({ question }) => {
  const { questions, setQuestions, currentQuestionIndex, selectedDate, setSelectedDate } =
    useContext(GlobalStateContext);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].inputs[0].value = date;
    setQuestions(updatedQuestions);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedQuestions = [...questions];
    const currentInput = updatedQuestions[currentQuestionIndex].inputs.find((input) => input.name === name);
    currentInput.value = value;
    setQuestions(updatedQuestions);
  };

  return (
    <>
      {question.inputs.map((input, index) => {
        if (input.type === 'tel') {
          return <PhoneField input={input} key={index} onChange={handleInputChange} />;
        }

        if (input.type === 'text') {
          return (
            <TextField
              key={index}
              label={input.label}
              name={input.name}
              value={input.value}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          );
        }

        if (input.type === 'geo') {
          return <AddressAutoComplete input={input} key={index} />;
        }

        if (input.type === 'select') {
          return <ServiceSelect input={input} key={index} />;
        }

        if (input.type === 'textarea') {
          return (
            <TextField
              key={index}
              label={input.label}
              name={input.name}
              value={input.value}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              margin="normal"
            />
          );
        }

        if (input.type === 'datetime') {
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns} key={index}>
              <Stack direction="row" spacing={2} style={{ marginTop: '1rem' }}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                  fullWidth
                />
                <TimePicker label="Select Time" value={selectedDate} onChange={handleDateChange} fullWidth />
              </Stack>
            </LocalizationProvider>
          );
        }
        return null;
      })}
    </>
  );
};

export default Answer;
