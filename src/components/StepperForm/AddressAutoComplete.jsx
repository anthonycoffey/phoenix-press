import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { useState } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import InputAdornment from '@mui/material/InputAdornment';

const libraries = ['places'];

export default function AddressAutoComplete({
  onPlaceChanged,
  error,
  helperText,
  value,
  onChange,
  onLocationGeocoded,
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

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              onLocationGeocoded(results[0]);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Autocomplete
      onLoad={handleLoad}
      onPlaceChanged={handlePlaceChanged}
      fields={['address_components', 'formatted_address', 'geometry']}
      fullWidth
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
        variant='filled'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={handleGeolocate}
                color='primary'
                aria-label='use my location'
              >
                <MyLocationIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Autocomplete>
  );
}
