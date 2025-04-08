import {
	useState,
	useEffect,
	useRef,
	// useContext, // Removed
	Suspense,
	useCallback, // Added
} from '@wordpress/element';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LocationIcon from './LocationIcon';
import { useLoadScript } from '@react-google-maps/api';
// Removed: import { GlobalStateContext } from '../state.js';

// Helper function remains the same
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

// Accept onInputChange and errors via props
export default function AddressAutoComplete({ input, onInputChange, errors }) {
	// Removed context usage
	// const { questions, currentQuestionIndex, setQuestions, errors, setErrors } = useContext(GlobalStateContext);
	const [loadingLocation, setLoadingLocation] = useState(false);
	const inputRef = useRef(null);
	const autocompleteRef = useRef(null); // Ref to store autocomplete instance

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: LOCALIZED?.GMAPS_API_KEY,
		libraries,
	});

	// Internal handler to call the parent's onInputChange
	const triggerParentOnChange = useCallback(
		(value, isObject = false) => {
			if (onInputChange && input?.name) {
				// If it's an address object, pass it along. Otherwise, pass the text value.
				// The parent handler needs to be aware of this structure.
				// For simplicity now, let's always pass the formatted string value,
				// and maybe store the object separately if needed later.
				let stringValue = '';
				if (isObject && value) {
					stringValue =
						`${value.address_1 || ''}, ${value.city || ''}, ${value.state || ''} ${value.zipcode || ''}`
							.replace(/^, |, $/g, '')
							.trim();
				} else {
					stringValue = value;
				}
				// Call parent's handler with the input's actual name and the string value
				onInputChange(input.name, stringValue);
				// Optionally pass the object too if parent needs it:
				// onInputChange(input.name, stringValue, isObject ? value : null);
			}
			// Removed: setErrors logic
		},
		[onInputChange, input?.name]
	);

	useEffect(() => {
		if (
			!isLoaded ||
			!inputRef.current ||
			!window.google ||
			autocompleteRef.current
		)
			return; // Don't re-init

		const autocomplete = new window.google.maps.places.Autocomplete(
			inputRef.current
		);
		autocompleteRef.current = autocomplete; // Store instance

		const handlePlaceChanged = () => {
			try {
				const place = autocomplete.getPlace();
				if (place && place.address_components) {
					const addressObj = getAddressObject(
						place.address_components
					);
					triggerParentOnChange(addressObj, true); // Pass object to handler
				} else {
					console.warn(
						'Place changed, but no address components found.'
					);
					// Optionally trigger update with current input text if needed
					// triggerParentOnChange(inputRef.current.value, false);
				}
			} catch (error) {
				console.error('Error handling place_changed event:', error);
			}
		};

		autocomplete.addListener('place_changed', handlePlaceChanged);

		// Cleanup function
		// Note: Standard cleanup might remove the listener, but Google Maps API handles this differently.
		// We might not need explicit listener removal if the component unmounts cleanly.
		// However, keeping it for safety if needed:
		// return () => {
		// 	if (autocomplete) {
		//         window.google.maps.event.clearInstanceListeners(autocomplete);
		//     }
		// };
	}, [isLoaded, triggerParentOnChange]); // Depend on isLoaded and the stable callback

	const handleUseGps = useCallback(() => {
		if (!navigator.geolocation || !window.google) {
			console.error('Geolocation or Google Maps API not available.');
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
							triggerParentOnChange(addressObj, true); // Pass object to handler
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
	}, [triggerParentOnChange]); // Depend on stable callback

	// Handler for direct text input changes in the TextField
	const handleTextInputChange = useCallback(
		(event) => {
			triggerParentOnChange(event.target.value, false); // Pass text value to handler
		},
		[triggerParentOnChange]
	); // Depend on stable callback

	// Removed: validateLocation function

	if (loadError) {
		console.error('Error loading maps:', loadError);
		return <div>Error loading maps</div>;
	}

	if (!isLoaded) {
		return <LinearProgress />;
	}

	return (
		// Suspense might not be strictly necessary here unless loading child components
		// <Suspense fallback={<LinearProgress />}>
		<Stack spacing={2} direction="column" sx={{ marginTop: '1rem' }}>
			<TextField
				label={input?.label || 'Address'}
				name={input?.name || 'location'}
				// Use the value from the parent state
				value={input?.value || ''}
				onChange={handleTextInputChange} // Use specific handler for text changes
				variant="outlined"
				margin="normal"
				fullWidth
				inputRef={inputRef} // Ref for Google Autocomplete
				InputProps={{
					endAdornment: loadingLocation ? (
						<LinearProgress sx={{ width: '50px' }} />
					) : null, // Show progress in adornment
				}}
				required={!input?.optional}
				// Use errors passed via props
				error={!!errors?.[input?.name]}
				helperText={errors?.[input?.name] || ''}
				size="small" // Added size small
			/>
			<Button
				variant="contained"
				aria-label="Use my location"
				color="primary"
				onClick={handleUseGps}
				disabled={loadingLocation}
				startIcon={<LocationIcon />} // Use startIcon
			>
				{/* Removed icon from here */}
				Use My Current Location
			</Button>
		</Stack>
		// </Suspense>
	);
}
