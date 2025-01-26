const Button = MaterialUI.Button;
const Card = MaterialUI.Card;
const CardContent = MaterialUI.CardContent;
const Stack = MaterialUI.Stack;
const Box = MaterialUI.Box;
const CardHeader = MaterialUI.CardHeader;
const Cancel = (
  <svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1iirmgg"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    data-testid="CancelIcon"
  >
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"></path>
  </svg>
);
const LinearProgress = MaterialUI.LinearProgress;
import Prompt from "./Prompt";
import Answer from "./Answer";
import Disclaimer from "./Disclaimer";
import { useContext, useEffect, useState } from "@wordpress/element";
import { GlobalStateContext } from "../state";

const ConversationalForm = () => {
  const {
    questions,
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

  const [invalid, setInvalid] = useState(true);
  const [formStarted, setFormStarted] = useState(false);
  const [formSubmissionId, setFormSubmissionId] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState(null);

  useEffect(() => {
    const hasErrors = currentQuestion.inputs.some(
      (input) => errors[input.name],
    );
    setInvalid(hasErrors);

    return () => {
      setInvalid(true);
    };
  }, [errors]);

  useEffect(() => {
    if (isFormVisible && window.turnstile) {
      const id = window.turnstile.render("#conversation-turnstile-widget", {
        sitekey: LOCALIZED.TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          window.turnstile.reset(id);
        },
      });
    }
  }, [isFormVisible]);

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

    const headers = {
      "Content-Type": "application/json",
      "X-Turnstile-Token": turnstileToken,
    };
    const source =
      window.location.origin.replace(/^https?:\/\//, "") +
      window.location.pathname.replace(/\/$/, "");

    if (currentQuestionIndex + 1 === questions.length) {
      return await completeSubmission(submission, source);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }

    if (!formStarted) {
      setFormStarted(true);
      if (window?.dataLayer) {
        window.dataLayer.push({
          event: "form_start",
        });
      }
    }

    try {
      if (!turnstileToken) {
        return false;
      }

      if (formSubmissionId) {
        await fetch(
          `${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ submission, source }),
          },
        );
      } else {
        const response = await fetch(`${LOCALIZED.API_URL}/submit-lead-form`, {
          method: "POST",
          headers,
          body: JSON.stringify({ submission, source }),
        });

        const result = await response.json();
        if (result?.id) {
          setFormSubmissionId(result?.id);
        }
      }
    } catch (error) {
      console.error("There was an error", error);
    } finally {
      setLoading(false);
    }
  };

  const completeSubmission = async (submission, source) => {
    try {
      setLoading(true);
      if (formSubmissionId) {
        await fetch(
          `${LOCALIZED.API_URL}/submit-lead-form/${formSubmissionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Turnstile-Token": turnstileToken,
            },
            body: JSON.stringify({
              submission,
              completed: true,
              source,
            }),
          },
        );
      }

      if (window?.dataLayer) {
        window.dataLayer.push({
          event: "form_submit",
          submission,
          source,
          completed: true,
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error("There was an error", error);
    } finally {
      setLoading(false);
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

      {isFormVisible && (
        <Card className="phoenix-form">
          <CardHeader
            action={
              <Button onClick={toggleFormVisibility} aria-label="close">
                <Cancel />
              </Button>
            }
          />

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
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      width: "100%",
                      display: "flex",
                      my: "1rem",
                      justifyContent:
                        currentQuestionIndex > 0 ? "space-between" : "flex-end",
                    }}
                  >
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
                      sx={{ justifySelf: "end" }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={invalid || loading || !turnstileToken}
                    >
                      {currentQuestionIndex + 1 === questions.length
                        ? "Submit"
                        : "Next"}
                    </Button>
                  </Stack>
                  <Disclaimer index={currentQuestionIndex} />
                  <Box
                    spacing={2}
                    className={"phoenix-no-select"}
                    sx={{
                      width: "100%",
                      display: "flex",
                      my: "1rem",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "1rem",
                    }}
                  >
                    {(loading || !turnstileToken) && (
                      <LinearProgress sx={{ width: "100%" }} />
                    )}
                  </Box>
                </CardContent>
              </>
            )}
          </>

          <div
            id="conversation-turnstile-widget"
            className="cf-turnstile"
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "1rem 0",
              padding: "1rem",
            }}
            data-sitekey={LOCALIZED.TURNSTILE_SITE_KEY}
          ></div>
        </Card>
      )}
    </section>
  );
};

export default ConversationalForm;
