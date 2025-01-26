import React, { createContext, useEffect, useState } from 'react';
export const GlobalStateContext = createContext();

import questionData from './utils/form-data';
import servicesData from './utils/services';

export const GlobalStateProvider = ({ children }) => {
	const [questions, setQuestions] = useState(questionData || null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [services, setServices] = useState(servicesData || null);
	const [errors, setErrors] = useState({});

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
