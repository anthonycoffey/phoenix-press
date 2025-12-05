import { useState, useEffect } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { makesAndModels } from '../../utils/makesAndModels';

const VehicleSelector = ({ formData, handleChange, errors }) => {
  const [models, setModels] = useState([]);
  const makes = Object.keys(makesAndModels);

  useEffect(() => {
    if (formData.car_make) {
      setModels(makesAndModels[formData.car_make] || []);
    } else {
      setModels([]);
    }
  }, [formData.car_make]);

  const handleMakeChange = (event, value) => {
    handleChange({ target: { name: 'car_make', value } });
    handleChange({ target: { name: 'car_model', value: '' } }); // Reset model on make change
  };

  const handleModelChange = (event, value) => {
    handleChange({ target: { name: 'car_model', value } });
  };

  return (
    <Stack spacing={2}>
      <Autocomplete
        options={makes}
        value={formData.car_make}
        onChange={handleMakeChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='filled'
            label='Vehicle Make'
            error={!!errors.car_make}
            helperText={errors.car_make}
            margin='none'
            fullWidth
          />
        )}
      />
      <Autocomplete
        options={models}
        value={formData.car_model}
        onChange={handleModelChange}
        disabled={!formData.car_make}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='filled'
            label='Vehicle Model'
            error={!!errors.car_model}
            helperText={errors.car_model}
            margin='none'
            fullWidth
          />
        )}
      />
    </Stack>
  );
};

export default VehicleSelector;
