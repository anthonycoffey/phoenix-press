import React, { useState, useEffect, useRef } from "react";
import { TextField, Stack, IconButton, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from "@react-google-maps/api";

// Helper function to extract address details
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

export default function AddressAutoComplete({ input, onChange }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const autocompleteRef = useRef(null); // Ref for the TextField
  const inputRef = useRef(null); // Ref for the Autocomplete

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // Replace with your API key
    libraries: ["places"],
  });

  // Hook: Initialize Autocomplete once Google Maps API is loaded
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const addressObj = getAddressObject(place.address_components);
      onChange(addressObj);
    });

    // Cleanup
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  // Function: Handle geolocation and reverse geocoding for the GPS button
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
              onChange(addressObj);
            } else {
              console.error("Geocoder failed due to: " + status);
            }
          },
        );
      },
      (err) => {
        setLoadingLocation(false);
        console.error("Error in getting geolocation: ", err);
      },
    );
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Component JSX
  return (
    <Stack spacing={2} direction="row">
      {/* TextField with ref for Autocomplete */}
      <TextField
        label={input.label}
        name={input.name}
        value={input.value}
        onChange={onChange}
        variant="outlined"
        margin="normal"
        fullWidth
        inputRef={inputRef}
        InputProps={{
          endAdornment: loadingLocation ? <CircularProgress size={20} /> : null,
        }}
      />
      {/* GPS Button */}
      <IconButton
        variant="contained"
        aria-label="Use my location"
        color="primary"
        onClick={handleUseGps}
        disabled={loadingLocation}
      >
        {loadingLocation ? <CircularProgress size={20} /> : <LocationOnIcon />}
      </IconButton>
    </Stack>
  );
}
