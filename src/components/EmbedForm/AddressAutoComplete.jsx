import { useState, useEffect, useRef } from "@wordpress/element";
const TextField = MaterialUI.TextField;
const Stack = MaterialUI.Stack;
const Button = MaterialUI.Button;
const CircularProgress = MaterialUI.CircularProgress;
const LinearProgress = MaterialUI.LinearProgress;
const LocationOnIcon = (
  <svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="MyLocationIcon"
  >
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7"></path>
  </svg>
);
import { useLoadScript } from "@react-google-maps/api";

const getAddressObject = (address_components) => {
  const obj = {};
  if (!address_components) return obj;

  const number = address_components.find((c) =>
    c.types.includes("street_number"),
  )?.long_name;
  const street = address_components.find((c) =>
    c.types.includes("route"),
  )?.short_name;

  obj.address_1 = number && street ? `${number} ${street}` : "";
  obj.city =
    address_components.find((c) => c.types.includes("locality"))?.long_name ||
    "";
  obj.state =
    address_components.find((c) =>
      c.types.includes("administrative_area_level_1"),
    )?.short_name || "";
  obj.country =
    address_components.find((c) => c.types.includes("country"))?.short_name ||
    "";
  obj.zipcode =
    address_components.find((c) => c.types.includes("postal_code"))
      ?.long_name || "";

  return obj;
};

const libraries = ["places"];

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
      inputRef.current,
    );
    const handlePlaceChanged = () => {
      try {
        const place = autocomplete.getPlace();
        const addressObj = getAddressObject(place.address_components);
        handleInputChange(addressObj);
      } catch (error) {
        console.error("Error handling place_changed event:", error);
      }
    };

    autocomplete.addListener("place_changed", handlePlaceChanged);

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
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
            if (status === "OK" && results[0]) {
              const addressObj = getAddressObject(
                results[0].address_components,
              );
              handleInputChange(addressObj);
              handleBlur();
            } else {
              console.error("Geocoder failed due to:", status);
            }
          },
        );
      },
      (err) => {
        setLoadingLocation(false);
        console.error("Error in getting geolocation:", err);
      },
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
    setErrors((prevErrors) => ({ ...prevErrors, [input.name]: errorMessage }));
  };

  const validateLocation = (input) => {
    if (!input.optional)
      return !input.value.trim() ? "This field is required" : "";
  };

  if (loadError) {
    console.error("Error loading maps:", loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LinearProgress />;
  }

  return (
    <Stack
      spacing={2}
      direction="column"
      sx={{ marginTop: "1rem", display: "flex", width: "100%" }}
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
          endAdornment: loadingLocation ? <CircularProgress size={20} /> : null,
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
        {loadingLocation ? <CircularProgress size={20} /> : <LocationOnIcon />}
        Use My Current Location
      </Button>
    </Stack>
  );
}
