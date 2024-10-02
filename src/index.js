import React, { useContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, CardContent, CardActions, CircularProgress, Stack, Modal, Box, Typography } from '@mui/material';
import Prompt from './components/Prompt';
import Answer from './components/Answer';
import './styles.sass';
import questionData from './utils/questions';

import { GlobalStateContext, GlobalStateProvider } from './state.js'; // Import context

const PhoenixForm = () => {
  const {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    loading,
    setLoading,
    submitted,
    setSubmitted,
    selectedDate,
    isFormVisible,
    setIsFormVisible,
  } = useContext(GlobalStateContext);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isFormVisible) {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        const formData = JSON.parse(savedData);

        // Check if any input has a non-empty value
        const hasFilledField = formData.some((question) =>
          question.inputs.some((input) => input.value && input.value.trim() !== '')
        );

        if (hasFilledField) {
          setShowModal(true);
        }
      }
    }
  }, [isFormVisible]);

  const handleContinue = () => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setQuestions(JSON.parse(savedData));
    }
    setShowModal(false);
  };

  const handleNewStart = () => {
    localStorage.removeItem('formData'); // Clear saved data
    setQuestions(questionData);
    setCurrentQuestionIndex(0);
    setShowModal(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Toggle form visibility
  };

  const handleSubmit = async () => {
    const isLastQuestion = currentQuestionIndex + 1 === questions.length;

    if (isLastQuestion) {
      setLoading(true);
      const submission = questions.map((question) =>
        question.inputs.map((input) => ({
          name: input.name,
          value: input.value,
        }))
      );

      const completed = currentQuestionIndex + 1 === questions.length;
      const source = window.location.href;
      console.log({ submission, completed, source });
      try {
        fetch(
          LOCALIZED.API_URL + '/submit-lead-form',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          { submission, completed, source }
        ).then((response) => {
          console.log('Response:', response);
          setSubmitted(true);
        });
      } catch (error) {
        console.error('There was an error', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <button
        onClick={toggleFormVisibility}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#4395ce',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        aria-label="Show Lead Form"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="e-font-icon-svg e-fas-comment-alt"
          viewBox="0 0 512 512"
          width="24"
          height="24"
          fill="#fff"
        >
          <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z" />
        </svg>
      </button>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80%',
            transform: 'translate(-50%, -50%)', // Centering the modal
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Continue existing submission?</Typography>
          <Typography variant="body1">
            It looks like you started this form before. Would you like to pick up where you left off?
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" color="secondary" onClick={handleNewStart}>
              Start Over
            </Button>
            <Button variant="contained" color="primary" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>

      {isFormVisible && (
        <Card className="phoenix-form">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {submitted && (
                <CardContent>
                  <Stack space={2}>
                    <Prompt question={{ prompt: 'Thank you for your submission! We will contact you shortly.' }} />
                  </Stack>
                </CardContent>
              )}

              {!submitted && (
                <>
                  <CardContent>
                    <Stack space={2}>
                      <Prompt question={currentQuestion} />
                      <Answer question={currentQuestion} selectedDate={selectedDate} />
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    {currentQuestionIndex > 0 && (
                      <Button variant="contained" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                        Back
                      </Button>
                    )}
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                      {currentQuestionIndex + 1 === questions.length ? 'Submit' : 'Next'}
                    </Button>
                  </CardActions>
                </>
              )}
            </>
          )}
        </Card>
      )}
    </>
  );
};

const rootElement = document.getElementById('phoenix-form-root');
const root = createRoot(rootElement);
root.render(
  <GlobalStateProvider>
    <PhoenixForm />
  </GlobalStateProvider>
);
