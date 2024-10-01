import React, { useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  CircularProgress,
  Stack,
} from "@mui/material";
import Prompt from "./components/Prompt";
import Answer from "./components/Answer";
import axios from "axios";
import "./styles.sass";

import { GlobalStateContext, GlobalStateProvider } from "./state"; // Import context

const PhoenixForm = () => {
  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    loading,
    setLoading,
    submitted,
    setSubmitted,
    selectedDate,
    isFormVisible,
    setIsFormVisible,
    services,
  } = useContext(GlobalStateContext); // Access global state

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
        })),
      );
      try {
        // todo: replace with correct submission endpoint and test
        await axios.post("/api/submit", { submission });
        setSubmitted(true);
      } catch (error) {
        console.error("Error submitting the form", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (submitted) {
    return (
      <div className="submitted-container">
        <Avatar alt="Success" src="/success-icon.png" />
        <h4>Submitted Successfully</h4>
      </div>
    );
  }

  console.log({ services });

  return (
    <>
      {/*<pre>{JSON.stringify(questions, null, 2)}</pre>*/}
      <button
        onClick={toggleFormVisibility}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4395ce",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
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

      {isFormVisible && (
        <Card className="phoenix-form">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <CardContent>
                <Stack space={2}>
                  <Prompt question={currentQuestion} />
                  <Answer
                    question={currentQuestion}
                    selectedDate={selectedDate}
                  />
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
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
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {currentQuestionIndex + 1 === questions.length
                    ? "Submit"
                    : "Next"}
                </Button>
              </CardActions>
            </>
          )}
        </Card>
      )}
    </>
  );
};

const rootElement = document.getElementById("phoenix-form-root");
const root = createRoot(rootElement);
root.render(
  <GlobalStateProvider>
    <PhoenixForm />
  </GlobalStateProvider>,
);
