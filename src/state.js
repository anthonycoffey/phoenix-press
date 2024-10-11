import React, { createContext, useEffect, useState } from "react";
export const GlobalStateContext = createContext();
import questionData from "./utils/questions";

export const GlobalStateProvider = ({ children }) => {
  const [questions, setQuestions] = useState(() => {
    try {
      const savedData = localStorage.getItem("formData");
      return savedData ? JSON.parse(savedData) : questionData;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return questionData;
    }
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [services, setServices] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (questions) {
      localStorage.setItem("formData", JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(LOCALIZED.API_URL + "/get-form-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        let { data } = result;
        if (!data && !data.length) {
          console.log("No services found in the response.");
        } else {
          const services = data
            ?.filter((service) => !service?.isDefault && !service?.isInternal)
            .map((service) => ({
              text: service.name,
              value: service.name,
              id: service.id,
            }));
          setServices(services);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        isFormVisible,
        setIsFormVisible,
        services,
        setServices,
        errors,
        setErrors,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
