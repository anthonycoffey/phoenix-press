import { useState, useEffect, useRef } from '@wordpress/element';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import LocationIcon from '../LocationIcon';
import { useLoadScript } from '@react-google-maps/api';

const getAddressObject = (address_components) => {
	const obj = {};
	if (!address_components) return obj;

	const number = address_components.find((c) =>
		c.types.includes('street_number')
	)?.long_name;
	const street = address_components.find((c) =>
		c.types.includes('route')
	)?.short_name;

	obj.address_1 = number && street ? `${number} ${street}` : '';
	obj.city =
		address_components.find((c) => c.types.includes('locality'))
			?.long_name || '';
	obj.state =
		address_components.find((c) =>
			c.types.includes('administrative_area_level_1')
		)?.short_name || '';
	obj.country =
		address_components.find((c) => c.types.includes('country'))
			?.short_name || '';
	obj.zipcode =
		address_components.find((c) => c.types.includes('postal_code'))
			?.long_name || '';

	return obj;
};

const libraries = ['places'];

export default function AddressAutoComplete({ input, handleBlur }) {
	const [loadingLocation, setLoadingLocation] = useState(false);
	const [errors, setErrors] = useState({});
	const inputRef = useRef(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: LOCALIZED?.GMAPS_API_KEY,
		libraries,
	});

	useEffect(() => {
		if (!inputRef.current || !window.google) return;

		const autocomplete = new window.google.maps.places.Autocomplete(
			inputRef.current
		);
		const handlePlaceChanged = () => {
			try {
				const place = autocomplete.getPlace();
				const addressObj = getAddressObject(place.address_components);
				handleInputChange(addressObj);
			} catch (error) {
				console.error('Error handling place_changed event:', error);
			}
		};

		autocomplete.addListener('place_changed', handlePlaceChanged);

		return () => {
			window.google.maps.event.clearInstanceListeners(autocomplete);
		};
	}, [isLoaded]);

	const handleUseGps = () => {
		if (!navigator.geolocation) {
			console.error('Geolocation is not supported by your browser.');
			return;
		}

		setLoadingLocation(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				const geocoder = new window.google.maps.Geocoder();

				geocoder.geocode(
					{ location: { lat: latitude, lng: longitude } },
					(results, status) => {
						setLoadingLocation(false);
						if (status === 'OK' && results[0]) {
							const addressObj = getAddressObject(
								results[0].address_components
							);
							handleInputChange(addressObj);
							handleBlur();
						} else {
							console.error('Geocoder failed due to:', status);
						}
					}
				);
			},
			(err) => {
				setLoadingLocation(false);
				console.error('Error in getting geolocation:', err);
			}
		);
	};

	const handleInputChange = (event) => {
		if (event.nativeEvent instanceof Event) {
			input.value = event.target.value;
		} else {
			input.obj = event;
			input.value = `${event.address_1}, ${event.city}, ${event.state} ${event.zipcode}`;
		}

		const errorMessage = validateLocation(input);
		setErrors((prevErrors) => ({
			...prevErrors,
			[input.name]: errorMessage,
		}));
	};

	const validateLocation = (input) => {
		if (!input.optional)
			return !input.value.trim() ? 'This field is required' : '';
	};

	if (loadError) {
		console.error('Error loading maps:', loadError);
		return <div>Error loading maps</div>;
	}

	if (!isLoaded) {
		return <LinearProgress />;
	}

	return (
		<Stack
			spacing={2}
			direction="column"
			sx={{ marginTop: '1rem', display: 'flex', width: '100%' }}
		>
			<TextField
				label={input.label}
				name={input.name}
				value={input.value}
				onChange={handleInputChange}
				onBlur={handleBlur}
				variant="outlined"
				margin="normal"
				fullWidth
				inputRef={inputRef}
				InputProps={{
					endAdornment: loadingLocation ? (
						<CircularProgress size={20} />
					) : null,
				}}
				required={!input.optional}
				error={!!errors[input.name]}
				helperText={errors[input.name]}
			/>
			<Button
				variant="contained"
				aria-label="Use my location"
				color="primary"
				onClick={handleUseGps}
				disabled={loadingLocation}
			>
				{loadingLocation ? (
					<CircularProgress size={20} />
				) : (
					<LocationIcon />
				)}
				Use My Current Location
			</Button>
		</Stack>
	);
}
