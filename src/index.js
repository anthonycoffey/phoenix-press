import React, { useContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Modal,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import Prompt from "./components/Prompt";
import Answer from "./components/Answer";
import Disclaimer from "./components/Disclaimer";
import SkeletonChat from "./components/SkeletonChat";
import { GlobalStateContext, GlobalStateProvider } from "./state.js";
import {
  safeLocalStorageGetItem,
  safeLocalStorageSetItem,
  safeLocalStorageRemoveItem,
} from "./utils/localStorageUtils";

import "./styles.sass";
import questionData from "./utils/form-data";

import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "https://dd1a8a07e9b52037987d3792acac547e@o4505751809884160.ingest.us.sentry.io/4508072984313856",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
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
  const [formStarted, setFormStarted] = useState(false);
  const [formSubmissionId, setFormSubmissionId] = useState(null);

  useEffect(() => {
    const hasErrors = currentQuestion.inputs.some(
      (input) => errors[input.name],
    );
    const isEmpty = currentQuestion.inputs.some(
      (input) =>
        !input.optional &&
        (input.value === "" ||
          input.value === false ||
          (Array.isArray(input.value) && input.value.length === 0)),
    );
    setInvalid(hasErrors || isEmpty);
  }, [errors, currentQuestionIndex]);

  useEffect(() => {
    if (isFormVisible || embed) {
      const savedData = safeLocalStorageGetItem("formData");
      const savedIndex = safeLocalStorageGetItem("currentQuestionIndex");
      if (savedData && savedIndex) {
        const formData = JSON.parse(savedData);

        const hasFilledField = formData.some((question) =>
          question.inputs.some(
            (input) =>
              typeof input.value === "string" && input.value.trim() !== "",
          ),
        );

        if (hasFilledField) {
          setShowModal(true);
        }
      }
    }
  }, [isFormVisible]);

  const handleContinue = () => {
    const savedData = safeLocalStorageGetItem("formData");
    const savedIndex = safeLocalStorageGetItem("currentQuestionIndex");
    const savedFormId = safeLocalStorageGetItem("formSubmissionId");
    if (savedData && savedIndex) {
      setQuestions(JSON.parse(savedData));
      setCurrentQuestionIndex(parseInt(savedIndex));
    }
    if (savedFormId) {
      setFormSubmissionId(savedFormId);
    }
    setShowModal(false);
  };

  const handleNewStart = () => {
    safeLocalStorageRemoveItem("formData");
    safeLocalStorageRemoveItem("currentQuestionIndex");
    safeLocalStorageRemoveItem("formSubmissionId");
    setSubmitted(false);
    setQuestions(questionData);
    setFormSubmissionId(null);
    setCurrentQuestionIndex(0);
    setShowModal(false);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const submission = questions.flatMap((question) =>
      question.inputs.map((input) => {
        const { name, value, obj } = input;
        return obj ? { name, value, obj } : { name, value };
      }),
    );

    safeLocalStorageSetItem(
      "currentQuestionIndex",
      String(currentQuestionIndex),
    );

    const headers = {
      "Content-Type": "application/json",
    };
    const source =
      window.location.origin.replace(/^https?:\/\//, "") +
      window.location.pathname.replace(/\/$/, "");

    try {
      let response;
      if (formSubmissionId) {
        response = await fetch(
          `${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({ submission, source }),
          },
        );
      } else {
        if (!formStarted) {
          setFormStarted(true);
          if (window?.dataLayer) {
            window.dataLayer.push({
              event: "form_start",
            });
          }
        }
        response = await fetch(`${LOCALIZED.API_URL}/submit-lead-form`, {
          method: "POST",
          headers,
          body: JSON.stringify({ submission, source }),
        });

        const result = await response.json();
        setFormSubmissionId(result?.id);
        safeLocalStorageSetItem("formSubmissionId", result?.id);
      }

      if (currentQuestionIndex + 1 === questions.length) {
        console.log("completeSubmission function call");
        await completeSubmission(submission, source);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error) {
      console.log("There was an error", error);
      Sentry.captureException(new Error(error));
    } finally {
      setLoading(false);
    }
  };

  const completeSubmission = async (submission, source) => {
    try {
      if (formSubmissionId) {
        await fetch(
          `${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ submission, completed: true, source }),
          },
        );
      }

      setSubmitted(true);

      if (window?.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          submission,
          source,
          completed: true,
        });
      }
    } catch (error) {
      console.log("There was an error", error);
    }
  };

  return (
    <section>
      <button
        onClick={toggleFormVisibility}
        id="phoenix-show-form-button"
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
            position: "absolute",
            top: "60%",
            left: "60%",
            width: "75%",
            transform: "translate(-60%, -60%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Continue existing submission?</Typography>
          <Typography variant="body1">
            It looks like you started this form before. Would you like to pick
            up where you left off?
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleNewStart}
            >
              Start Over
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>

      {(isFormVisible || embed) && (
        <Card className="phoenix-form">
          {loading ? (
            <SkeletonChat />
          ) : (
            <>
              {submitted && (
                <CardContent>
                  <Stack space={2}>
                    <Prompt
                      question={{
                        prompt: LOCALIZED.SUBMISSION_MESSAGE,
                      }}
                    />
                  </Stack>
                </CardContent>
              )}

              {!submitted && (
                <>
                  <CardContent>
                    <Stack space={2}>
                      <Prompt question={currentQuestion} />
                      <Answer question={currentQuestion} />
                      <Disclaimer index={currentQuestionIndex} />
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between" }}>
                    {currentQuestionIndex > 0 && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          setCurrentQuestionIndex(currentQuestionIndex - 1)
                        }
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      style={{ justifyContent: "flex-end" }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={invalid || loading}
                    >
                      {currentQuestionIndex + 1 === questions.length
                        ? "Submit"
                        : "Next"}
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

const chat = document.getElementById("phoenix-form-root");
const root = createRoot(chat);
root.render(
  <GlobalStateProvider>
    <PhoenixForm />
  </GlobalStateProvider>,
);

const roots = document.querySelectorAll(".phoenix-form-embed-root");
roots.forEach((el) => {
  createRoot(el).render(
    <GlobalStateProvider>
      <PhoenixForm embed={true} />
    </GlobalStateProvider>,
  );
});
