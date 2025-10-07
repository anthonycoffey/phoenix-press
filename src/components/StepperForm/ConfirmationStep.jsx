import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CheckCircleOutlineTwoTone from '@mui/icons-material/CheckCircleOutlineTwoTone';
import parse from 'html-react-parser';

export default function ConfirmationStep() {
  return (
    <Alert
      id="submission-success"
      severity="success"
      icon={<CheckCircleOutlineTwoTone sx={{ fontSize: 32 }} />}
    >
      <AlertTitle>We have received your information!</AlertTitle>
      {parse(LOCALIZED.SUBMISSION_MESSAGE)}
    </Alert>
  );
}
