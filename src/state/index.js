import React, { createContext, useEffect, useState } from "react";
export const GlobalStateContext = createContext();
import questionData from "../assets/questions";

export const GlobalStateProvider = ({ children }) => {
  const [questions, setQuestions] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : questionData;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [services, setServices] = useState(null);

  // Save to localStorage whenever questions change
  useEffect(() => {
    if (questions) {
      localStorage.setItem("formData", JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    setLoading(true);
    fetch(LOCALIZED.API_URL + "/get-form-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let { data } = response;
        if (!data) {
          return new Error("No data found in response");
        } else {
          const services = data
            ?.filter((service) => !service?.isDefault && !service?.isInternal)
            .map((service) => ({
              text: service.name,
              value: service.name,
              id: service.id,
            }));
          setServices(services);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching form data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        loading,
        setLoading,
        submitted,
        setSubmitted,
        selectedDate,
        setSelectedDate,
        isFormVisible,
        setIsFormVisible,
        services,
        setServices,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
