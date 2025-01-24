const requiredFields = [
  "full_name",
  "phone",
  "service_time",
  "location",
  "service_type",
];

const validateField = (field, submission) => {
  const fieldData = submission.find((item) => item.name === field);
  return fieldData && validationRules[field](fieldData.value);
};

const isSubmissionComplete = (submission, requiredFields) => {
  return requiredFields.every((field) => validateField(field, submission));
};

const validationRules = {
  full_name: (value) => {
    return value.trim() !== "";
  },
  phone: (value) => {
    return value.trim() !== "";
  },
  service_time: (value) => {
    return !isNaN(new Date(value).getTime());
  },
  location: (value) => {
    return value.trim() !== "";
  },
  service_type: (value) => {
    return Array.isArray(value) && value.length > 0;
  },
};

export { requiredFields, validateField, isSubmissionComplete, validationRules };
