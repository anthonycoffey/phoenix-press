import React, { createContext, useEffect, useState } from "react";
export const GlobalStateContext = createContext();
import questionData from "../assets/questions";

export const GlobalStateProvider = ({ children }) => {
  const [questions, setQuestions] = useState(questionData || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [services, setServices] = useState(null);

  useEffect(() => {
    if (!questions) {
      setQuestions(questionData);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/wp-json/phoenix-press/v1/get-form-data")
      .then((response) => response.json())
      .then((response) => {
        let { data } = response;
        const services = data
          ?.filter((service) => !service?.isDefault && !service?.isInternal)
          .map((service) => ({
            text: service.name,
            value: service.name,
            id: service.id,
          }));
        setServices(services);
        setLoading(false);
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
