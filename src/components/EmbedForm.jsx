import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
} from "@mui/material";
import Prompt from "./Prompt";
import questionData from "../utils/embed-form-data";
import "../styles.sass";
import InputField from "./InputField";
import Disclaimer from "./Disclaimer";

const useThrottledSubmit = (submitFunction, delay = 500) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const throttledSubmit = useCallback(
    debounce(async (args) => {
      try {
        setIsSubmitting(true);
        await submitFunction(args);
      } catch (error) {
        console.error("Throttled submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, delay),
    [submitFunction, delay],
  );

  return { throttledSubmit, isSubmitting };
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

import { requiredFields, isSubmissionComplete } from "../utils/validation";

export default function EmbedForm({ embed }) {
  const [questions] = useState(questionData || false);
  const [invalid, setInvalid] = useState(true);
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [formSubmissionId, setFormSubmissionId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checked, setChecked] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);

  useEffect(() => {
    if (window.turnstile) {
      const id = window.turnstile.render("#turnstile-widget", {
        sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          console.log("expired callback running", { id });
          window.turnstile.reset(id);
        },
      });
    }
  }, []);

  useEffect(() => {
    // note: valid phone number and turnstile token are required to submit the form
    if (turnstileToken && validPhoneNumber) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  }, [turnstileToken, validPhoneNumber]);

  const handleSubmit = async (buttonPressed) => {
    if (isSubmitting) return false;
    setLoading(true);

    if (buttonPressed) {
      setSubmitButtonPressed(true);
    }

    const submission = questions.flatMap((question) =>
      question.inputs.map((input) => {
        const { name, value, obj } = input;
        return obj ? { name, value, obj } : { name, value };
      }),
    );

    const headers = {
      "Content-Type": "application/json",
      "X-Turnstile-Token": turnstileToken,
    };

    const source =
      window.location.origin.replace(/^https?:\/\//, "") +
      window.location.pathname.replace(/\/$/, "");

    if (!turnstileToken) return false;

    try {
      const completed = isSubmissionComplete(submission, requiredFields);

      if (formSubmissionId) {
        await fetch(
          `${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ submission, source, completed }),
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

        const response = await fetch(`${LOCALIZED.API_URL}/submit-lead-form`, {
          method: "POST",
          headers,
          body: JSON.stringify({ submission, source, completed }),
        });

        const result = await response.json();
        if (result?.id) {
          setFormSubmissionId(result?.id);
        }
      }

      if (buttonPressed) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("There was an error", error);
    } finally {
      setLoading(false);
    }
  };

  const { throttledSubmit, isSubmitting } = useThrottledSubmit(handleSubmit);

  const handleTextChange = ({ input, event }) => {
    input.value = event?.target?.value;
  };

  const handleDateChange = ({ input, event }) => {
    input.value = event;
    setSelectedDate(event);
  };

  const handleBlur = () => {
    if (!invalid) {
      throttledSubmit();
    }
  };

  const handleConsentChange = ({ input, event }) => {
    const { checked } = event?.target;
    input.value = checked;
    setChecked(checked);
  };

  return (
    <section>
      <Card className="phoenix-form">
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
          <form aria-label="Form Description" autoComplete="on" noValidate>
            <CardContent>
              <Stack space={4}>
                {questions?.map((question, index) => {
                  if (question.type === "row") {
                    return (
                      <Box
                        key={index}
                        display="flex"
                        flexDirection="row"
                        gap={2}
                      >
                        {question.inputs.map((input, index) => (
                          <InputField
                            key={index}
                            input={input}
                            handleTextChange={handleTextChange}
                            handleDateChange={handleDateChange}
                            handleConsentChange={handleConsentChange}
                            selectedDate={selectedDate}
                            setValidPhoneNumber={setValidPhoneNumber}
                            checked={checked}
                            setChecked={setChecked}
                            handleBlur={handleBlur}
                          />
                        ))}
                      </Box>
                    );
                  } else {
                    return question.inputs.map((input, index) => (
                      <InputField
                        key={index}
                        input={input}
                        handleTextChange={handleTextChange}
                        handleDateChange={handleDateChange}
                        handleConsentChange={handleConsentChange}
                        selectedDate={selectedDate}
                        setValidPhoneNumber={setValidPhoneNumber}
                        checked={checked}
                        setChecked={setChecked}
                        handleBlur={handleBlur}
                      />
                    ));
                  }
                })}
              </Stack>
              <Box>
                <Disclaimer index={0} />
              </Box>
              <div
                id="turnstile-widget"
                className="cf-turnstile"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1rem 0",
                  padding: "1rem",
                }}
                data-sitekey={LOCALIZED.TURNSTILE_SITE_KEY}
              ></div>
            </CardContent>

            <CardActions sx={{ justifyContent: "end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleSubmit(true);
                }}
                disabled={invalid || submitButtonPressed}
              >
                Submit
              </Button>
              <>{loading || (isSubmitting && <LinearProgress />)}</>
            </CardActions>
          </form>
        )}
      </Card>
    </section>
  );
}
