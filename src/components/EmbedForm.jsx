import React, { useEffect, useState } from "react";
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

export default function EmbedForm({ embed }) {
  const [questions] = useState(questionData || false);
  const [invalid, setInvalid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [formSubmissionId, setFormSubmissionId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checked, setChecked] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  // const [widgetId, setWidgetId] = useState(null);

  console.log(LOCALIZED.TURNSTILE_SITE_KEY, "local");

  useEffect(() => {
    if (window.turnstile) {
      const id = window.turnstile.render("#turnstile-widget", {
        sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          // Turnstile calls this when token expires
          window.turnstile.reset(id);
        },
      });
      // setWidgetId(id);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

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
    console.log({ headers });

    const source =
      window.location.origin.replace(/^https?:\/\//, "") +
      window.location.pathname.replace(/\/$/, "");

    try {
      if (formSubmissionId) {
        const completed = questions.every((question) =>
          question.inputs.every(
            (input) =>
              input.optional ||
              submission.some(
                (sub) => sub.name === input.name && sub.value !== "",
              ),
          ),
        );

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
          body: JSON.stringify({ submission, source }),
        });

        const result = await response.json();
        setFormSubmissionId(result?.id);
      }
    } catch (error) {
      console.error("There was an error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = ({ input, event }) => {
    input.value = event?.target?.value;
  };

  const handleDateChange = ({ input, event }) => {
    setSelectedDate(event);
    input.value = event;
  };

  const handleBlur = () => {
    handleSubmit();
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
                            setInvalid={setInvalid}
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
                        setInvalid={setInvalid}
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
                  handleSubmit();
                }}
                disabled={invalid || loading}
              >
                Submit
              </Button>
            </CardActions>
          </form>
        )}
      </Card>
    </section>
  );
}
