import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const libraries = ['places'];

export default function AddressAutoComplete({
  onPlaceChanged,
  error,
  helperText,
  value,
  onChange,
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: window.LOCALIZED?.GMAPS_API_KEY,
    libraries,
  });

  console.log(
    'Google Maps API Loaded:',
    isLoaded,
    window.LOCALIZED?.GMAPS_API_KEY
  );

  const [autocomplete, setAutocomplete] = useState(null);

  const handleLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      onPlaceChanged(autocomplete.getPlace());
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Box>
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
        fields={['address_components', 'formatted_address', 'geometry']}
      >
        <TextField
          label='Location'
          name='location'
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          fullWidth
          margin='normal'
        />
      </Autocomplete>
    </Box>
  );
}
