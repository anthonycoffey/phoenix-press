import { createContext, useState, useMemo } from '@wordpress/element';
export const GlobalStateContext = createContext();

// Keep initial data imports if they are needed elsewhere or as default values
import questionData from './utils/form-data';
import servicesData from './utils/services';

export const GlobalStateProvider = ({ children }) => {
	// State that is truly global or less volatile
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false);
	// Assuming services data is relatively stable and might be needed globally
	const [services, setServices] = useState(servicesData || null);

	// Memoize the simplified context value
	const providerValue = useMemo(
		() => ({
			loading,
			setLoading,
			submitted,
			setSubmitted,
			isFormVisible,
			setIsFormVisible,
			services,
			setServices,
			// Provide initial question data if components need it for initialization
			// This reference should be stable as it comes from an import
			initialQuestions: questionData,
		}),
		[
			loading,
			submitted,
			isFormVisible,
			services,
			// Setters are stable and don't need to be dependencies
		]
	);

	return (
		<GlobalStateContext.Provider value={providerValue}>
			{children}
		</GlobalStateContext.Provider>
	);
};
