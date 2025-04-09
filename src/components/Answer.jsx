import { useContext, useState, memo, useCallback } from '@wordpress/element'; // Import memo, useCallback
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddressAutoComplete from './AddressAutoComplete';
import ServiceSelect from './ServiceSelect';
import PhoneField from './PhoneField';
import parse from 'html-react-parser';
import { GlobalStateContext } from '../state';
import { Switch, Box } from '@mui/material';

// Wrap component in React.memo
// Accept 'questionInputs', 'errors', and 'services' as props
const Answer = memo(
  ({ questionInputs, onInputChange, onDateChange, errors, services }) => {
    // Ensure questionInputs is an array before mapping
    const inputs = Array.isArray(questionInputs) ? questionInputs : [];

    // Use useCallback for handlers if they have complex logic or dependencies
    // that might change, otherwise inline functions are often fine.
    const handleDateChange = useCallback(
      (name, date) => {
        // Call the callback prop passed from ConversationalForm
        if (onDateChange) {
          onDateChange(name, date);
        }
      },
      [onDateChange]
    ); // Dependency: the callback prop itself

    const handleInputChange = useCallback(
      (event) => {
        const { name, value, type, checked } = event.target;
        // Call the callback prop passed from ConversationalForm
        if (onInputChange) {
          onInputChange(name, type === 'checkbox' ? checked : value);
        }
      },
      [onInputChange]
    ); // Dependency: the callback prop itself

    return (
      <Box>
        {inputs.map((input) => {

          if (input.type === 'text' || input.type === 'email') {
            return (
              <TextField
                key={input.name}
                label={input.label}
                name={input.name}
                value={input.value || ''}
                onChange={handleInputChange}
                fullWidth
                variant='outlined'
                margin='normal'
                error={!!errors[input.name]}
                helperText={errors[input.name]}
                required={!input.optional}
                size='small'
              />
            );
          } else if (input.type === 'textarea') {
            return (
              <TextField
                key={input.name}
                label={input.label}
                name={input.name}
                value={input.value || ''}
                onChange={handleInputChange}
                fullWidth
                required={!input.optional}
                variant='outlined'
                margin='normal'
                size='small'
                multiline
                rows={3}
              />
            );
          } else if (input.type === 'tel') {
            return (
              <PhoneField
                input={input}
                key={input.name}
                onChange={handleInputChange}
                errors={errors}
              />
            );
          } else if (input.type === 'geo') {
            return (
              <AddressAutoComplete
                input={input}
                key={input.name}
                onInputChange={onInputChange}
                errors={errors}
              />
            );
          } else if (input.type === 'checkbox') {
            return (
              <FormControlLabel
                key={input.name}
                control={
                  <Switch
                    checked={!!input.value}
                    onChange={handleInputChange}
                    name={input.name}
                    required={!input.optional}
                  />
                }
                size='small'
                className='phoenix-conversational-form__consent-switch'
                label={parse(LOCALIZED.SMS_CONSENT_MESSAGE || input.label || '')}
              />
            );
          } else if (input.type === 'select') {
            return (
              <ServiceSelect
                input={input}
                key={input.name}
                onInputChange={onInputChange}
                errors={errors}
                services={services}
              />
            );
          } else if (input.type === 'datetime') {
            return (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                key={input.name}
              >
                <Stack direction='row' spacing={2} sx={{ marginTop: '1rem' }}>
                  <DatePicker
                    label='Select Date'
                    value={input.value ? new Date(input.value) : null}
                    onChange={(date) => handleDateChange(input.name, date)}
                    disablePast
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                  <TimePicker
                    label='Select Time'
                    value={input.value ? new Date(input.value) : null}
                    onChange={(date) => handleDateChange(input.name, date)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            );
          } else {
            return (
              <div key={input.name}>{`Unknown input type "${input.type}"`}</div>
            );
          }

        })}
      </Box>
    );
  }
);

export default Answer;
