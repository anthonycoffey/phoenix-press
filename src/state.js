import React, { createContext, useEffect, useState } from 'react';
export const GlobalStateContext = createContext();
import questionData from './utils/questions';

export const GlobalStateProvider = ({ children }) => {
  const [questions, setQuestions] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : questionData;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [services, setServices] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (questions) {
      localStorage.setItem('formData', JSON.stringify(questions));
    }
  }, [questions]);

  useEffect(() => {
    setLoading(true);
    fetch(LOCALIZED.API_URL + '/get-form-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        let { data } = response;
        if (!data && !data.length) {
          return new Error('Unable to get services...');
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
        console.error('Error fetching form data:', error);
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
