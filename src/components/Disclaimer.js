import { Alert } from "@mui/material";
import React from "react";
import parse from "react-html-parser";

const Disclaimer = ({ index }) => {
  return (
    index === 0 && (
      <>
        {LOCALIZED.DISCLAIMER_MESSAGE && (
          <Alert severity="info">{parse(LOCALIZED.DISCLAIMER_MESSAGE)}</Alert>
        )}
      </>
    )
  );
};

export default Disclaimer;
