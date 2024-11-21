import { Alert } from "@mui/material";
import React from "react";

const Disclaimer = ({ index }) => {
  return (
    index === 0 && (
      <>
        <Alert severity="info">
          By providing your phone number, you agree that it may be used to
          contact you via phone regarding your roadside service request. Phone
          consent is required to schedule and coordinate your service. SMS
          consent is optional and will only be used if you opt-in. You can
          opt-out at any time by texting "STOP."
        </Alert>
      </>
    )
  );
};

export default Disclaimer;
