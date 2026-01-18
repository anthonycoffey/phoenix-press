# Active Context

* **Current Focus:** Fixing a crash and validation issue in `EmbedForm`'s `PhoneField`.
* **Recent Changes:**
    * **Split Testing Mechanics Updated:**
        * Removed 30-day cookie persistence for split testing in `includes/SplitTest.php`.
        * Implemented a pure random assignment strategy per request (no cookies used).
        * Updated `includes/Settings.php` analytics description to reflect the "no cookie" approach.
    * Fixed `Uncaught TypeError` in `src/components/EmbedForm/PhoneField.jsx` by passing `handleTextChange` prop from `src/components/InputField.jsx`.
    * Implemented phone number validation in `src/components/EmbedForm/PhoneField.jsx` by using the `setValidPhoneNumber` prop and checking for 10-digit input.
    * Implemented local state management (`useState`, `useEffect`) in `src/components/EmbedForm/PhoneField.jsx` to resolve typing responsiveness issues caused by the parent `EmbedForm`'s mutation-based state management pattern (which prevented immediate re-renders).
    * Updated `src/components/StepperForm/ServiceCarousel.jsx`:
        * Added a chips section above the carousel to display selected services.
        * Enabled Swiper Navigation module to show arrows for better scroll affordance.
        * Styled navigation arrows using MUI theme tokens (`primary.main`, `background.paper`) to ensure visibility in dark/light modes.
    * Updated both form components (`EmbedForm.jsx` and `ConversationalForm.jsx`) to use `gtag()` instead of `dataLayer` for analytics tracking (form_start and form_submit events).
    * Modified `src/utils/form-data.js` to add a new optional 'email' step after the 'phone' step in the conversational form. (Previous task)
    * Modified `src/utils/embed-form-data.js` to add a new optional 'email' field after the 'phone' field in the embed form. (Previous task)
    * Modified `src/components/EmbedForm.jsx` to remove `window.location.assign` and display `LOCALIZED.SUBMISSION_MESSAGE` upon successful submission. (Previous task)
    * Modified `src/components/ConversationalForm.jsx` to remove `window.location.assign` and use `LOCALIZED.SUBMISSION_MESSAGE` in the final prompt upon successful submission. (Previous task)
    * Created new branch `feature/inline-success-message`. (Previous task)
    * Modified `src/components/ConversationalForm.jsx` to keep navigation buttons visible but disabled during loading states, improving UX. (Previous task)
    * Modified `src/components/ConversationalForm.jsx` to add `gtag('set', 'user_data', ...)` call within `completeSubmission` function, using email and phone state values for enhanced conversions. (Previous task)
    * Modified `src/components/EmbedForm.jsx` to add `gtag('set', 'user_data', ...)` call within `handleSubmit` function, using email and phone state values for enhanced conversions. (Previous task)
    * Refactored `src/components/EmbedForm.jsx` to use `useCallback` for event handlers (`handleTextChange`, `handleDateChange`, `handleBlur`, `handleConsentChange`, `handleFinalSubmit`).
    * Refactored `src/components/ConversationalForm.jsx` to use `useCallback` for event handlers and submission logic (`toggleFormVisibility`, `completeSubmission`, `handleSubmit`, `handleBackClick`, `handleNextSubmitClick`) and `useMemo` for derived values (`currentQuestion`, `source`, `headers`).
    * Corrected `EmbedForm.jsx` to ensure the Google Analytics `form_submit` event only fires on final, explicit submission, not on auto-saves triggered by blur events.
    * Optimized auto-save logic in `EmbedForm.jsx`:
        * Replaced `onBlur` trigger with debouncing (2.5s delay after input change).
        * Introduced `isDirty` state to save only when actual changes occur.
        * Removed `blurTimeoutRef`, added `debounceTimeoutRef`.
        * Updated change handlers (`handleTextChange`, `handleDateChange`, `handleConsentChange`) to trigger debounced save.
        * Updated `handleSubmit` to reset `isDirty` state on successful save.
    * Modified `EmbedForm.jsx` and `ConversationalForm.jsx` submission logic to use a `useRef` flag (`gtagUserDataSentRef`) ensuring `gtag('set', 'user_data', ...)` is called only once per component instance upon submission when email is present.
    * Memoized the context value object in `src/state.js` using `useMemo` to prevent unnecessary re-renders of context consumers.
    * Refactored `src/components/Answer.jsx`:
        * Wrapped in `React.memo`.
        * Removed direct context manipulation (`setQuestions`, `setErrors`).
        * Introduced callback props (`onInputChange`, `onDateChange`).
        * Removed internal `useEffect` for date handling.
    * Updated `src/utils/validation.js` to include `validateInputObject` function for validating single input objects.
    * Refactored `src/components/ConversationalForm.jsx`:
        * Implemented memoized callback handlers (`handleAnswerInputChange`, `handleAnswerDateChange`) to receive data from `Answer`.
        * Centralized state updates (`setQuestions`, `setErrors`) and validation logic within these handlers.
        * Passed the new handlers as props to `Answer`.
        * Updated button `disabled` logic to use memoized `isCurrentQuestionInvalid` state derived from `errors`.
        * Imported and used `validateInputObject` for validation.
    * Simplified `ConversationalForm.jsx` state management by localizing form state (`questions`, `errors`, `currentQuestionIndex`) and removing Turnstile/debouncing logic for debugging.
    * Passed granular props (`questionPrompt`, `questionInputs`) to children (`Prompt`, `Answer`) instead of the whole `currentQuestion` object.
    * Refined input handlers (`handleAnswerInputChange`, `handleAnswerDateChange`) in `ConversationalForm.jsx` to perform strict checks and only call state setters if data actually changed.
    * Temporarily commented out `AddressAutoComplete` component rendering within `Answer.jsx` to isolate potential source of infinite re-rendering. (Previous step)
    * Further simplified `Answer.jsx` by commenting out all specific input components (`PhoneField`, `ServiceSelect`, `Switch`, `DatePicker`, `TimePicker`, etc.) except basic `TextField`s, as a debugging step. (Resolved infinite loop)
    * Re-enabled `PhoneField` component in `Answer.jsx`.
    * Refactored `PhoneField.jsx` to remove context usage, correct `onChange` data, rely on props for errors, and pass raw digits value up.
    * Updated `Answer.jsx` to pass `errors` prop down to `PhoneField`.
    * Re-enabled `AddressAutoComplete` and refactored it to remove context usage, use `onInputChange` prop, and rely on props for errors.
    * Re-enabled `Switch` (via `FormControlLabel`) in `Answer.jsx`.
    * Re-enabled `ServiceSelect` and refactored it to remove context usage, use props (`input`, `services`, `onInputChange`, `errors`), and call parent handler correctly. Updated `Answer` and `ConversationalForm` to pass `services` prop down.
    * Re-enabled `DatePicker` and `TimePicker` in `Answer.jsx`.
    * Updated `ConversationalForm.jsx` state initialization to set default value for `datetime` inputs to current time (ISO string) if no value exists.
    * Updated `validateInputObject` in `src/utils/validation.js` to check for empty required email fields immediately.
    * Corrected phone number validation in `validateInputObject` to check the length of the raw digit string (10 digits).
    * Re-introduced validation `useEffect` hook in `ConversationalForm.jsx` to separate validation logic from input handlers.
    * Restored Cloudflare Turnstile integration (state, effect, ref, conditional logic) in `ConversationalForm.jsx`.
    * Reverted addition of `.phoenix-form` styles in `src/styles.css` (to avoid affecting embed form).
    * Added inline styles (`width: max-content`, `minWidth: 300px`, `maxWidth: 500px`, `marginLeft: auto`) to the `<Card>` component in `src/components/ConversationalForm.jsx` using the `sx` prop to constrain its width like a chatbox.
    * Simplified `src/components/ConversationalForm.jsx` navigation logic: Back button always navigates immediately. Next/Submit button only shows "Securing form, please wait..." alert if `turnstileToken` is null; if `loading` is true (fetch active), clicks are ignored (no alert, no action).
    * Modified `src/components/ConversationalForm.jsx` `handleNextSubmitClick` function to show a "Saving, please wait...." alert when `loading` is true, instead of ignoring the click.
    * Modified `src/components/ServiceSelect.jsx` to format its output data as an array of objects `[{value: ..., id: ...}]` before passing it to the parent via `onInputChange`, aligning it with the data structure used by `EmbedForm/Services.jsx`.
    * Refactored `src/components/ConversationalForm.jsx` navigation UX: Replaced the `Alert` component for loading/Turnstile states with inline `Typography` messages ("Saving...", "Securing..."). Updated the Next/Submit button's `disabled` state to include `loading` and `!turnstileToken` checks. Removed the `navigationWarning` state and associated logic.
    * Modified `src/components/EmbedForm.jsx` success message display: Replaced the `<Prompt>` component with a styled MUI `<Alert>` component within a `<Box>` to provide more vertical space and a standard success UI, while still parsing HTML from `LOCALIZED.SUBMISSION_MESSAGE` using `html-react-parser`.
    * Modified `src/components/EmbedForm.jsx` to add a `useEffect` hook that scrolls the page smoothly to the `#submission-success` element upon successful submission.
    * Refactored `src/components/StepperForm.jsx` by extracting its internal component definitions (`CustomerInfoStep`, `VehicleInfoStep`, `QuoteStep`, `PaymentStep`, `ConfirmationStep`) into separate files within `src/components/StepperForm/`.
    * Modified `src/components/StepperForm/QuoteStep.jsx` to restructure the quote breakdown display:
        * Filtered "Additional Fees" to only include "Luxury Uplift" and "Time Surcharge".
        * Identified "Specialty Services" as any breakdown item not matching the surcharge list (e.g., New Key, Tire Replacement).
        * Calculated "Base Price" by subtracting Surcharges and Specialty Services from the total Quote.
        * Updated the table to display "Base Price" first, followed by itemized Specialty Services, then Additional Fees.
        * Added a conditional disclaimer below the table when Specialty Services are present.
    * Fixed `includes/Database.php` table creation issue where `DEFAULT '0000-00-00 00:00:00'` caused failures in MySQL with `NO_ZERO_DATE` mode. Updated to use `DEFAULT CURRENT_TIMESTAMP`.
    * Added error logging to `Database::record_event` to capture future database insertion errors.
    * Enhanced `includes/Settings.php` to implement a "HubSpot-style" reporting dashboard:
        * Added an info box explaining split testing mechanics.
        * Separated statistics for the "Conversational Form" into a dedicated section.
        * Integrated **Highcharts** via CDN for data visualization.
        * Implemented Summary Metric Cards (Views, Submissions, Rate).
        * Added Column Charts for Conversion Rate comparison and Engagement Volume (Views vs Starts vs Submissions).
        * Added a Funnel Chart for Conversational Form performance.
    * Refactored `includes/Settings.php` to improve admin UI/UX:
        * Moved plugin menu from "Settings" submenu to a top-level "Phoenix Press" menu.
        * Created two distinct subpages: "Settings" (for configuration) and "Analytics" (for the dashboard).
        * Implemented a native WordPress tabbed interface within the "Settings" page with three sections: **API Settings**, **Form Settings**, and **A/B Testing**.
        * Styled the Settings page form with a cleaner, card-based layout (`.phoenix-settings-card`) to match the dashboard aesthetics.
        * Optimized asset loading to enqueue Highcharts only on the Analytics page and Media scripts only on the Settings page.
* **Next Steps:** Verify the phone field fix and ensure form submission works correctly.
* **Active Decisions:**
    * **Split Testing:** Switched to a "no cookie" approach as requested. Variants are assigned randomly on every request. This prioritizes equal traffic distribution and user privacy/simplicity over persistence.
    * Used local state in `EmbedForm/PhoneField` to handle input updates. This decouples the input's visual state from the parent form's state management (which relies on mutation and delayed re-renders), ensuring a smooth typing experience.
    * Implemented validation in `EmbedForm/PhoneField` by checking for 10-digit input and updating the parent's validation state, ensuring the form cannot be submitted with an incomplete phone number.
    * Restructured `QuoteStep` pricing display to align with invoice format: "Base Price" covers core services, "Specialty Services" are itemized individually, and "Additional Fees" are strictly for surcharges (Luxury, Time).
    * Added a disclaimer for Specialty Services to clarify deposit requirements and final cost approval.
    * Used MUI `Stack` and `Chip` for displaying selected services to keep UI clean and consistent.
    * Used Swiper `Navigation` module for carousel arrows as it's a standard pattern for horizontal scrolling lists.
    * Styled Swiper navigation arrows using `sx` and theme values to ensure they are visible and fit the design system (especially in dark mode).
    * Added an optional 'email' field to both form types. (Previous task)
    * Implemented Google Analytics Enhanced Conversions tracking (`gtag('set', 'user_data', ...)`) in both `ConversationalForm.jsx` and `EmbedForm.jsx`, triggering before the `form_submit` event. User data (email, phone) is extracted from the form submission state. Phone numbers are attempted to be formatted to E.164. The `gtag` call is conditional on the presence of an email address and uses a `useRef` flag to ensure it only executes once per component instance during submission.
    * Standardized analytics tracking to use `gtag()` exclusively instead of mixing with `dataLayer`. Updated all form interaction events (form_start, form_submit) to use `gtag('event', ...)` syntax.
    * Reverted form submission behavior from redirect to inline success message display using `LOCALIZED.SUBMISSION_MESSAGE`. (Previous task)
    * Implemented conditional rendering in `EmbedForm.jsx` to show the message. (Previous task)
    * Updated the existing success prompt in `ConversationalForm.jsx` to use the localized message. (Previous task)
    * Kept navigation buttons in `ConversationalForm.jsx` visible but disabled during loading to prevent layout shifts and improve UX. (Previous task)
    * Applied `useCallback` and `useMemo` hooks in `EmbedForm.jsx` and `ConversationalForm.jsx` to optimize performance by memoizing functions and derived values, potentially reducing unnecessary re-renders of child components.
    * Modified the `handleSubmit` function in `EmbedForm.jsx` to make the `dataLayer.push({ event: 'form_submit' })` call conditional on the `submit` parameter being true, preventing it from firing during auto-saves.
    * Replaced the previous `onBlur`-based auto-save in `EmbedForm.jsx` with a debounced approach triggered by input changes, only saving when data is modified (`isDirty` state).
    * Addressed `ConversationalForm` performance issues by:
        * Memoizing the `GlobalStateContext` value object (`src/state.js`).
        * Decoupling `Answer.jsx` from direct state manipulation using callback props and `React.memo`.
        * Centralizing state updates and validation within `ConversationalForm.jsx` using memoized handlers.
        * Ensuring correct validation function (`validateInputObject`) is used.
    * Attempted various state management patterns (context memoization, localized state, functional updates, debouncing, strict updates, granular props) to resolve infinite re-rendering in `ConversationalForm`.
    * Isolated potential causes by commenting out specific input components within `Answer.jsx`.
    * Refactored `PhoneField`, `AddressAutoComplete`, and `ServiceSelect` to align with the parent-controlled state pattern, removing context dependencies.
    * Set default value for `datetime` inputs to current time upon initialization.
    * Improved email validation immediacy by updating `validateInputObject`.
    * Corrected phone number validation in `validateInputObject`.
    * Separated validation logic into a `useEffect` hook in `ConversationalForm`.
    * Restored Turnstile integration.
    * Styled the conversational form (`ConversationalForm.jsx`) to behave like a chatbox (min/max width, shrink-wrap content) using inline styles (`sx` prop) on the main `<Card>` component, ensuring styles do not affect the embed form.
    * Updated UX in `ConversationalForm.jsx` for navigation during processing: Replaced disruptive alerts for loading/Turnstile states with inline `Typography` messages ("Saving your answer, please wait...", "Securing form, please wait..."). The Next/Submit button is now disabled based on input validation errors (`hasInputErrors`), API loading state (`loading`), and Turnstile readiness (`!turnstileToken`). The Back button remains always enabled when visible.
    * Aligned the data structure passed up by `ServiceSelect.jsx` (used in `ConversationalForm`) to match the structure used by `EmbedForm/Services.jsx`. The `ServiceSelect` component now formats the selected services into an array of objects `[{value: ..., id: ...}]` within its `handleCheckboxChange` function before calling the `onInputChange` prop.
    * Replaced the success message implementation in `EmbedForm.jsx` from using the custom `Prompt` component to using standard MUI components (`Box`, `Alert`, `AlertTitle`, `CheckCircleOutlineIcon`, `Typography`) for a more conventional and vertically substantial success display, utilizing `html-react-parser` to render the `LOCALIZED.SUBMISSION_MESSAGE`.
    * Implemented smooth scrolling to the success message (`#submission-success`) in `EmbedForm.jsx` using a `useEffect` hook triggered by the `submitted` state.
    * Refactored `src/components/StepperForm.jsx` by extracting its internal component definitions (`CustomerInfoStep`, `VehicleInfoStep`, `QuoteStep`, `PaymentStep`, `ConfirmationStep`) into separate files within `src/components/StepperForm/`.
* **Key Patterns/Preferences:**
    * WordPress plugin structure.
    * PHP for backend/WordPress integration.
    * React (with MUI) for frontend components.
    * `@wordpress/scripts` for build tooling.
    * `Makefile` for orchestrating development tasks (install, start, build).
* **Learnings/Insights:** Gained initial understanding of the project's purpose, core technologies, and development setup from `README.md` and `package.json`.
