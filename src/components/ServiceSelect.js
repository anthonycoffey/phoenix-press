import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { useContext, useState } from "react";
import { GlobalStateContext } from "../state";

export default function ServiceSelect({ input }) {
  const { services } = useContext(GlobalStateContext); // Access global state
  const [selectedServices, setSelectedServices] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prev) =>
      checked ? [...prev, value] : prev.filter((service) => service !== value),
    );
  };

  return (
    <FormControl component="fieldset" fullWidth margin="normal">
      <FormGroup>
        {services.map((service) => (
          <FormControlLabel
            key={service.id}
            control={
              <Checkbox
                value={service.value} // Ensure value is set correctly
                checked={selectedServices.includes(service.value)}
                onChange={handleCheckboxChange}
                name={service.name}
              />
            }
            label={service.text}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
