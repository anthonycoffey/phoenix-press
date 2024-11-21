const options = [
  {
    name: "phone",
    prompt: "What is your phone number?",
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: "Enter your phone number",
        value: "",
        optional: false,
      },
      {
        name: "sms_consent",
        type: "checkbox",
        label:
          "I agree to receive SMS updates and notifications related to my roadside service request.",
        value: false,
        optional: true,
      },
    ],
  },
  {
    name: "full_name",
    prompt: "What is your name?",
    inputs: [
      {
        name: "full_name",
        type: "text",
        label: "Full Name",
        value: "",
        optional: true,
      },
    ],
  },
  {
    name: "location",
    prompt: "What is your current location?",
    inputs: [
      {
        name: "location",
        type: "geo",
        label: "Search for your location",
        value: "",
        obj: {},
        optional: true,
      },
    ],
  },
  {
    name: "service_time",
    prompt: "When do you need service?",
    inputs: [
      {
        value: "",
        type: "datetime",
        name: "service_time",
        selected: "",
        optional: false,
      },
    ],
  },
  {
    name: "service_type",
    prompt: "What service do you need?",
    inputs: [
      {
        value: [],
        valueId: null,
        type: "select",
        name: "service_type",
        optionsKey: "serviceOptions",
        options: [],
        optional: false,
      },
    ],
  },
  {
    prompt: "Please provide your car details",
    inputs: [
      {
        name: "car_make",
        type: "text",
        label: "Car Make",
        value: "",
        optional: true,
      },
      {
        name: "car_model",
        type: "text",
        label: "Car Model",
        value: "",
        optional: true,
      },
      {
        name: "car_year",
        type: "text",
        label: "Car Year",
        value: "",
        optional: true,
      },
      {
        name: "car_color",
        type: "text",
        label: "Color",
        value: "",
        optional: true,
      },
      {
        name: "car_plate",
        type: "text",
        label: "License Plate",
        value: "",
        optional: true,
      },
    ],
  },
  {
    prompt: "Please provide any additional information",
    inputs: [
      {
        name: "notes",
        type: "textarea",
        label: "Additional Information",
        value: "",
        optional: true,
      },
    ],
  },
];

export default options;
