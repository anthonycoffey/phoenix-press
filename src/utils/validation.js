const requiredFields = [
  "full_name",
  "phone",
  "service_time",
  "location",
  "car_year",
  "car_make",
  "car_model",
  "car_color",
  "service_type",
];

// Function to validate a single field
const validateField = (field, submission) => {
  const fieldData = submission.find((item) => item.name === field);
  console.log(`Validating field: ${field}`, fieldData);
  const isValid = fieldData && validationRules[field](fieldData.value);
  console.log(`Field ${field} is valid:`, isValid);
  return isValid;
};

const isSubmissionComplete = (submission, requiredFields) => {
  console.log(
    "Checking if submission is complete with submission:",
    submission,
  );
  const isComplete = requiredFields.every((field) =>
    validateField(field, submission),
  );
  console.log("Submission is complete:", isComplete);
  return isComplete;
};

const validationRules = {
  full_name: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for full_name: ${isValid}`);
    return isValid;
  },
  phone: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for phone: ${isValid}`);
    return isValid;
  },
  service_time: (value) => {
    const isValid = !isNaN(new Date(value).getTime());
    console.log(`Validation rule for service_time: ${isValid}`);
    return isValid;
  },
  location: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for location: ${isValid}`);
    return isValid;
  },
  car_year: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for car_year: ${isValid}`);
    return isValid;
  },
  car_make: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for car_make: ${isValid}`);
    return isValid;
  },
  car_model: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for car_model: ${isValid}`);
    return isValid;
  },
  car_color: (value) => {
    const isValid = value.trim() !== "";
    console.log(`Validation rule for car_color: ${isValid}`);
    return isValid;
  },
  service_type: (value) => {
    const isValid = Array.isArray(value) && value.length > 0;
    console.log(`Validation rule for service_type: ${isValid}`);
    return isValid;
  },
};

export { requiredFields, validateField, isSubmissionComplete, validationRules };
