const FormControl = MaterialUI.FormControl;
const FormControlLabel = MaterialUI.FormControlLabel;
const FormGroup = MaterialUI.FormGroup;
const Checkbox = MaterialUI.Checkbox;
const Box = MaterialUI.Box;
const FormHelperText = MaterialUI.FormHelperText;
const FormLabel = MaterialUI.FormLabel;
const { useContext, useEffect, useState } = React;
import { GlobalStateContext } from "../state";

export default function ServiceSelect({ input }) {
  const {
    questions,
    currentQuestionIndex,
    setQuestions,
    services,
    errors,
    setErrors,
  } = useContext(GlobalStateContext);

  const [selectedServices, setSelectedServices] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prev) =>
      checked ? [...prev, value] : prev.filter((service) => service !== value),
    );
  };

  useEffect(() => {
    const updatedQuestions = [...questions];
    const currentInput = updatedQuestions[currentQuestionIndex].inputs.find(
      (input) => input.name === "service_type",
    );

    const matchedServices = services.filter((service) =>
      selectedServices.includes(service.value),
    );
    currentInput.value = matchedServices.map((service) => ({
      value: service.value,
      id: service.id,
    }));

    setQuestions(updatedQuestions);

    const errorMessage = validateSelection(currentInput);
    setErrors({ ...errors, [currentInput.name]: errorMessage });
  }, [selectedServices]);

  const validateSelection = (input) => {
    if (!input.optional)
      return input.value.length < 1 ? "This field is required" : "";
  };

  return (
    <FormControl
      component="fieldset"
      fullWidth
      margin="dense"
      error={errors["service_type"]}
    >
      <FormLabel component="legend">Select desired service(s)</FormLabel>
      <FormGroup>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
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
      <FormHelperText>{errors["service_type"]}</FormHelperText>
    </FormControl>
  );
}
