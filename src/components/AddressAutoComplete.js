import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, Stack, IconButton, CircularProgress } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from "@react-google-maps/api";
import { GlobalStateContext } from "../state";

const getAddressObject = (address_components) => {
  const obj = {};
  if (!address_components) return obj;
  console.log(address_components);

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

export default function AddressAutoComplete({ input }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const inputRef = useRef(null); // Ref for the Autocomplete
  const { questions, currentQuestionIndex, setQuestions } =
    useContext(GlobalStateContext); // Access global state

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: data?.gmapsApiKey,
    libraries,
  });

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const addressObj = getAddressObject(place.address_components);
      handleInputChange(addressObj);
    });

    // Cleanup
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

  const handleInputChange = (event) => {
    console.log({ event });
    const updatedQuestions = [...questions];
    const currentInput = updatedQuestions[currentQuestionIndex].inputs.find(
      (input) => input.name === "location",
    );

    if (event.nativeEvent instanceof Event) {
      currentInput.value = event.target.value;
    } else {
      currentInput.obj = event;
      currentInput.value = `${event.address_1}, ${event.city}, ${event.state} ${event.zipcode}`;
    }

    setQuestions(updatedQuestions);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={2} direction="row" sx={{ marginBottom: "5px" }}>
      <TextField
        label={input.label}
        name={input.name}
        value={input.value}
        onChange={handleInputChange}
        variant="outlined"
        margin="normal"
        fullWidth
        inputRef={inputRef}
        InputProps={{
          endAdornment: loadingLocation ? <CircularProgress size={20} /> : null,
        }}
      />
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
