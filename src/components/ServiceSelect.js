import { FormControl, FormControlLabel, FormGroup, Checkbox, Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GlobalStateContext } from '../state';

export default function ServiceSelect({ input }) {
  const { questions, currentQuestionIndex, setQuestions, services } = useContext(GlobalStateContext);

  const [selectedServices, setSelectedServices] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prev) => (checked ? [...prev, value] : prev.filter((service) => service !== value)));
  };
  useEffect(() => {
    const updatedQuestions = [...questions];
    const currentInput = updatedQuestions[currentQuestionIndex].inputs.find((input) => input.name === 'service_type');
    currentInput.value = selectedServices;
    setQuestions(updatedQuestions);
  }, [selectedServices]);

  return (
    <FormControl component="fieldset" fullWidth margin="dense">
      <FormGroup>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            padding: 0,
          }}
        >
          {services.map((service) => (
            <FormControlLabel
              sx={{ margin: 0 }}
              control={
                <Checkbox
                  value={service.value}
                  checked={selectedServices.includes(service.value)}
                  onChange={handleCheckboxChange}
                  name={service.name}
                  size="small"
                />
              }
              label={service.text}
            />
          ))}
        </Box>
      </FormGroup>
    </FormControl>
  );
}
