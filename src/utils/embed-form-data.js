const options = [
  {
    name: "full_name",
    prompt: "What is your name?",
    inputs: [
      {
        name: "full_name",
        type: "text",
        label: "Enter your name",
        value: "",
        optional: true,
      },
    ],
  },
  {
    name: "phone",
    prompt: "What is your phone number?",
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: "Enter your phone number",
        value: "7379324565",
        optional: false,
      },
      {
        name: "sms_consent",
        type: "checkbox",
        label:
          "Yes, send me SMS updates and notifications to keep me informed about my roadside service request.",
        value: false,
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
    prompt: "Please provide your car details",
    type: "row",
    inputs: [
      {
        name: "car_year",
        type: "text",
        label: "Car Year",
        value: "",
        optional: true,
      },
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
        name: "car_color",
        type: "text",
        label: "Color",
        value: "",
        optional: true,
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
];

export default options;
