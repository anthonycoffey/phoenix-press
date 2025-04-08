const requiredFields = [
	'full_name',
	'phone',
	'service_time',
	'location',
	'service_type',
];

const validationRules = {
	full_name: (value) => {
		return value.trim() !== '';
	},
	phone: (value) => {
		return value.trim() !== '';
	},
	service_time: (value) => {
		return !isNaN(new Date(value).getTime());
	},
	location: (value) => {
		return value.trim() !== '';
	},
	service_type: (value) => {
		return Array.isArray(value) && value.length > 0;
	},
};

const validateField = (field, submission) => {
	const fieldData = submission.find((item) => item.name === field);
	// This validation seems incomplete based on the rules object.
	// It checks if the field exists and if the rule function returns true.
	// Let's keep it but note its potential limitations.
	return fieldData && validationRules[field]
		? validationRules[field](fieldData.value)
		: true; // Assume valid if no rule
};

// New function to validate a single input object
const validateInputObject = (input) => {
	if (!input) return ''; // Handle null/undefined input

	// Basic required check based on optional flag
	if (!input.optional) {
		// Handle different types for the "required" check
		switch (input.type) {
			case 'text':
			case 'email': // Treat email like text for the required check
			case 'tel':
			case 'textarea':
				if (!input.value || !String(input.value).trim()) {
					return 'This field is required';
				}
				break; // If not empty, proceed to format validation below
			case 'checkbox':
				if (!input.value) return 'This field is required'; // Check for truthy value
				break;
			case 'geo':
				// Assuming 'value' for geo is an object with address details or similar
				return !input.value || !input.value.address
					? 'Location is required'
					: '';
			case 'select':
				// Assuming 'value' for select is the selected service ID or object
				return !input.value ? 'Please select a service' : '';
			case 'datetime':
				// Check if value is a valid date representation
				return !input.value || isNaN(new Date(input.value).getTime())
					? 'Please select a date and time'
					: '';
			default:
				// For unknown types, assume valid if not optional and has some value
				return !input.value ? 'This field is required' : '';
		}
	}

	// Add specific format validation *after* the required check passed (if applicable)
	if (input.type === 'email' && input.value) {
		// Check format only if there's a value
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(input.value)) {
			return 'Invalid email format';
		}
	}

	// Add phone format validation *after* the required check passed (if applicable)
	if (input.type === 'tel' && input.value) {
		// The value received here from ConversationalForm's handler IS the raw digits string.
		// So, just check its length directly.
		return String(input.value).length !== 10
			? 'Valid 10-digit phone number is required.'
			: '';
	}

	return ''; // No error if optional or passes checks
};

const isSubmissionComplete = (submission, requiredFields) => {
	// This might need adjustment based on how validation is consistently applied
	return requiredFields.every((field) => validateField(field, submission));
};

const formatPhoneNumber = (value) => {
	if (!value) return ''; // Handle empty value
	const phoneNumber = value.replace(/\D/g, '');
	if (phoneNumber.length <= 3) return `(${phoneNumber}`;
	if (phoneNumber.length <= 6)
		return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
	return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export {
	formatPhoneNumber,
	requiredFields,
	validateField,
	validateInputObject,
	isSubmissionComplete,
	validationRules,
};
