import React, { useContext, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, CardContent, CardActions, CircularProgress, Stack, Modal, Box, Typography } from '@mui/material';
import Prompt from './components/Prompt';
import Answer from './components/Answer';
import './styles.sass';
import questionData from './utils/questions';
import { GlobalStateContext, GlobalStateProvider } from './state.js'; // Import context

import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: 'https://dd1a8a07e9b52037987d3792acac547e@o4505751809884160.ingest.us.sentry.io/4508072984313856',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const PhoenixForm = ({ embed }) => {
  const {
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    loading,
    setLoading,
    submitted,
    setSubmitted,
    isFormVisible,
    setIsFormVisible,
    errors,
  } = useContext(GlobalStateContext);
  const currentQuestion = questions[currentQuestionIndex];
  const [showModal, setShowModal] = useState(false);
  const [invalid, setInvalid] = useState(true);
  console.log({
    embed,
  });

  useEffect(() => {
    const hasErrors = currentQuestion.inputs.some((input) => errors[input.name]);
    const isEmpty = currentQuestion.inputs.some(
      (input) => !input.optional && (input.value === '' || (Array.isArray(input.value) && input.value.length === 0))
    );
    setInvalid(hasErrors || isEmpty);
  }, [errors, currentQuestionIndex]);

  useEffect(() => {
    if (isFormVisible || embed) {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        const formData = JSON.parse(savedData);

        const hasFilledField = formData.some((question) =>
          question.inputs.some((input) => typeof input.value === 'string' && input.value.trim() !== '')
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
    localStorage.removeItem('formData');
    setSubmitted(false);
    setQuestions(questionData);
    setCurrentQuestionIndex(0);
    setInvalid(true);
    setShowModal(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async () => {
    const isLastQuestion = currentQuestionIndex + 1 === questions.length;

    if (isLastQuestion) {
      setLoading(true);
      const submission = questions.flatMap((question) =>
        question.inputs.map((input) => {
          const { name, value, obj } = input;
          return obj ? { name, value, obj } : { name, value };
        })
      );

      const completed = true;
      const source = window.location.href;
      try {
        fetch(LOCALIZED.API_URL + '/submit-lead-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ submission, completed, source }),
        }).then(() => {
          setSubmitted(true);

          if (window?.dataLayer) {
            window.dataLayer.push({
              event: 'form_submit',
              submission,
              source,
              completed,
            });
          }
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

  return (
    <section>
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
            transform: 'translate(-50%, -50%)',
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

      {(isFormVisible || embed) && (
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
                      <Answer question={currentQuestion} />
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    {currentQuestionIndex > 0 && (
                      <Button variant="contained" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (currentQuestionIndex + 1 < questions.length) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          handleSubmit();
                        }
                      }}
                      disabled={invalid || loading}
                    >
                      {currentQuestionIndex + 1 === questions.length ? 'Submit' : 'Next'}
                    </Button>
                  </CardActions>
                </>
              )}
            </>
          )}
        </Card>
      )}
    </section>
  );
};

const chat = document.getElementById('phoenix-form-root');
const root = createRoot(chat);
root.render(
  <GlobalStateProvider>
    <PhoenixForm />
  </GlobalStateProvider>
);

const roots = document.querySelectorAll('.phoenix-form-embed-root');
roots.forEach((el) => {
  createRoot(el).render(
    <GlobalStateProvider>
      <PhoenixForm embed={true} />
    </GlobalStateProvider>
  );
});
