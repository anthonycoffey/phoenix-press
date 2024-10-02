import { FormControl, FormControlLabel, FormGroup, Checkbox, Box } from '@mui/material';
import { useContext, useState } from 'react';
import { GlobalStateContext } from '../state';

export default function ServiceSelect({ input }) {
  const { services } = useContext(GlobalStateContext); // Access global state
  const [selectedServices, setSelectedServices] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    // todo: if localstorage has value for this field, set it here
    setSelectedServices((prev) => (checked ? [...prev, value] : prev.filter((service) => service !== value)));
  };

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
