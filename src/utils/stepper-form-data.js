const options = [
	{
		name: 'full_name',
		type: 'row',
		title: 'Contact Information',
		label: 'Please enter your contact information.',
		inputs: [
			{
				name: 'full_name',
				type: 'text',
				label: 'Enter your name',
				value: '',
				optional: true,
			},
		],
	},
	{
		name: 'phone',
		inputs: [
			{
				name: 'phone',
				type: 'tel',
				label: 'Enter your phone number',
				value: '',
				optional: false,
			},
			{
				name: 'sms_consent',
				type: 'checkbox',
				label: 'Yes, send me SMS updates and notifications to keep me informed about my roadside service request.',
				value: false,
				optional: true,
			},
		],
	},
	{
		name: 'email',
		inputs: [
			{
				name: 'email',
				type: 'email',
				label: 'Enter your email address (optional)',
				value: '',
				optional: true,
			},
		],
	},
	{
		name: 'service_time',
		type: 'row',
		title: 'When do you need service?',
		label: 'Please verify service date and time.',
		inputs: [
			{
				value: '',
				type: 'datetime',
				name: 'service_time',
				selected: '',
				optional: false,
			},
		],
	},
	{
		name: 'location',
		type: 'row',
		title: 'Where is the vehicle located?',
		label: 'Please verify service location.',
		inputs: [
			{
				name: 'location',
				type: 'geo',
				label: 'Search for your location',
				value: '',
				obj: {},
				optional: true,
			},
		],
	},
	{
		type: 'row',
		title: 'Vehicle Details',
		label: 'Year, Make, Model, and Color',
		inputs: [
			{
				name: 'car_year',
				type: 'text',
				label: 'Year',
				value: '',
				optional: true,
			},
			{
				name: 'car_make',
				type: 'text',
				label: 'Make',
				value: '',
				optional: true,
			},
			{
				name: 'car_model',
				type: 'text',
				label: 'Model',
				value: '',
				optional: true,
			},
			{
				name: 'car_color',
				type: 'text',
				label: 'Color',
				value: '',
				optional: true,
			},
		],
	},
	{
		name: 'service_type',
		inputs: [
			{
				value: [],
				valueId: null,
				type: 'dropdown',
				name: 'service_type',
				optionsKey: 'serviceOptions',
				options: [],
				optional: false,
			},
		],
	},
	{
		inputs: [
			{
				name: 'notes',
				type: 'text',
				label: 'Additional Information',
				value: '',
				optional: true,
			},
		],
	},
];

export default options;
