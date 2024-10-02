const options = [
  {
    prompt: "What is your phone number?",
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: "Enter your phone number...",
        value: "",
        model: "",
        invalid: true,
      },
    ],
  },
  {
    prompt: "What is your name?",
    inputs: [
      {
        name: "full_name",
        type: "text",
        label: "Full Name",
        value: "",
      },
    ],
  },
  {
    prompt: "What is your current location?",
    inputs: [
      {
        name: "location",
        type: "geo",
        label: "Search for your location...",
        value: "",
        obj: {},
        lat: 0,
        lng: 0,
        invalid: true,
      },
    ],
  },
  {
    prompt: "When do you need service?",
    inputs: [
      {
        value: "",
        type: "datetime",
        name: "service_time",
        selected: "",
        dateDialog: false,
        timeDialog: false,
      },
    ],
  },
  {
    prompt: "What service do you need?",
    autoSubmit: true,
    inputs: [
      {
        value: "",
        valueId: null,
        type: "select",
        name: "service_type",
        optionsKey: "serviceOptions",
        options: [],
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
      },
      {
        name: "car_model",
        type: "text",
        label: "Car Model",
        value: "",
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
