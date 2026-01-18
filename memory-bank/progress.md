# Progress

* **Current Status:** The project exists with a basic structure, build system, and dependencies defined. Version 1.3.0 according to `package.json`. Core PHP classes for API, Assets, Meta, Plugin, and Settings are present. React components for various form elements exist. The Memory Bank has just been initialized and populated with baseline information.
* **What Works:** 
    * Project setup and dependency installation (`make install`).
    * Development server (`make start`).
    * Production build process (`make build`).
    * Plugin packaging (`npm run release`).
    * Basic WordPress plugin structure is in place (`phoenix-press.php`, `includes/`).
    * Frontend build pipeline using `@wordpress/scripts`.
    * Settings page infrastructure likely exists (`includes/Settings.php`, `readme-plugin-settings.png`).
    * Google Analytics `gtag` event tracking (`form_start`, `form_submit`) implemented in `EmbedForm.jsx` and `ConversationalForm.jsx`, replacing previous `dataLayer` implementation.
    * Form submission UX updated to show an inline success message (`LOCALIZED.SUBMISSION_MESSAGE`) instead of redirecting in both `EmbedForm.jsx` and `ConversationalForm.jsx`.
    * Conversational form (`ConversationalForm.jsx`) navigation UX improved: Replaced disruptive alerts for loading/Turnstile states with inline `Typography` messages ("Saving your answer, please wait...", "Securing form, please wait..."). The Next/Submit button is now disabled based on input validation errors (`hasInputErrors`), API loading state (`loading`), and Turnstile readiness (`!turnstileToken`). The Back button remains always enabled when visible.
    * Optional 'email' field added to both conversational (`src/utils/form-data.js`) and embed (`src/utils/embed-form-data.js`) form definitions.
    * Google Analytics Enhanced Conversions tracking (`gtag('set', 'user_data', ...)`) implemented in `ConversationalForm.jsx` and `EmbedForm.jsx`, using email and phone data from form state.
    * `EmbedForm.jsx` and `ConversationalForm.jsx` refactored to use `useCallback` and `useMemo` for performance optimization (memoizing event handlers, submission logic, and derived values).
    * Corrected `EmbedForm.jsx` to ensure the Google Analytics `form_submit` event only fires on final, explicit submission (not on auto-saves).
    * Optimized auto-save logic in `EmbedForm.jsx` using debouncing (2.5s delay after change) and tracking data changes (`isDirty` state), replacing the previous `onBlur` trigger.
    * Corrected `gtag('set', 'user_data', ...)` logic in `EmbedForm.jsx` and `ConversationalForm.jsx` to use a `useRef` flag, ensuring it only fires once per component instance during submission when email is present.
    * Optimized `ConversationalForm` performance:
        * Memoized `GlobalStateContext` value in `src/state.js`.
        * Refactored `Answer.jsx` to use `React.memo` and callback props, removing direct state manipulation.
        * Updated `ConversationalForm.jsx` to use memoized callbacks for handling `Answer` inputs and centralized state/validation logic.
        * Added and utilized `validateInputObject` in `src/utils/validation.js`.
    * Further debugging on `ConversationalForm` performance:
        * Localized form state (`questions`, `errors`, `currentQuestionIndex`).
        * Removed Turnstile integration and debouncing temporarily.
        * Passed granular props to children (`Prompt`, `Answer`).
        * Refined input handlers with strict immutable update checks.
        * Temporarily commented out `AddressAutoComplete` in `Answer.jsx` for isolation testing.
        * Further simplified `Answer.jsx` by commenting out most specific input components, which resolved the infinite re-rendering issue.
    * Incrementally re-enabled and refactored components in `Answer.jsx`:
        * `PhoneField`: Refactored to remove context dependency, fix errors. No performance regression observed.
        * `AddressAutoComplete`: Refactored to remove context dependency, fix errors. No performance regression observed.
        * `Switch` (via `FormControlLabel`): Re-enabled. No performance regression observed.
        * `ServiceSelect`: Refactored to remove context dependency, fix errors. No performance regression observed.
        * `DatePicker`/`TimePicker`: Re-enabled. No performance regression observed.
    * Updated `ConversationalForm.jsx` state initialization to default `datetime` inputs to current time.
    * Updated `validateInputObject` to improve email validation immediacy (check required status).
    * Corrected phone number validation logic in `validateInputObject` to check raw digit length.
    * Re-introduced validation `useEffect` hook in `ConversationalForm.jsx`.
    * Restored Cloudflare Turnstile integration in `ConversationalForm.jsx`.
    * Conversational form (`ConversationalForm.jsx`) styled via inline `sx` prop on the `<Card>` component to have `width: max-content`, `minWidth: 300px`, `maxWidth: 500px`, and `marginLeft: auto` for chatbox-like width behavior (reverted global CSS approach).
    * `ServiceSelect.jsx` (used in `ConversationalForm`) now formats its output data as an array of objects `[{value: ..., id: ...}]` before passing it up via `onInputChange`, aligning its data structure with `EmbedForm/Services.jsx`.
    * Embed form (`EmbedForm.jsx`) success message display refactored to use MUI `Alert` within a styled `Box` for better vertical presence, replacing the previous `Prompt` component implementation. Uses `html-react-parser` for rendering `LOCALIZED.SUBMISSION_MESSAGE`.
    * Embed form (`EmbedForm.jsx`) now smoothly scrolls to the success message (`#submission-success`) upon successful submission using a `useEffect` hook.
    * `StepperForm.jsx` refactored: extracted internal components (`CustomerInfoStep`, `VehicleInfoStep`, `QuoteStep`, `PaymentStep`, `ConfirmationStep`) into separate files within `src/components/StepperForm/` for better organization.
* **What's Left:**
    * Full implementation details of backend logic (API interactions, settings handling, processing new 'email' field).
    * Complete implementation and integration of frontend React components (ensuring 'email' field renders correctly).
    * Defining specific interactions with the Phoenix CRM API.
    * Unit tests (`phpunit.xml` exists, but extent of tests unknown).
    * Detailed documentation beyond the README and initial Memory Bank.
    * Filling in placeholder content in Memory Bank files (e.g., Success Metrics, specific Desired Experience details).
* **Known Issues:** None explicitly documented in `README.md` or inferred yet.
* **Decision Log:**
    * **[Date of Memory Bank Init - e.g., 2025-04-06]:** Initialized Memory Bank structure.
    * **[Date of Memory Bank Init - e.g., 2025-04-06]:** Populated Memory Bank based on `README.md` and `package.json`.
    * **2025-04-06:** Restored `gtag` event tracking (`form_start`, `form_submit`) to `EmbedForm.jsx` and `ConversationalForm.jsx` based on user-provided code snippets, ensuring only tracking logic was reintroduced.
    * **2025-04-09:** Standardized analytics tracking to use `gtag()` exclusively instead of mixing with `dataLayer`. Updated all form interaction events to use `gtag('event', ...)` syntax.
    * **2025-04-06:** Changed form submission behavior from redirecting to displaying an inline success message (`LOCALIZED.SUBMISSION_MESSAGE`) in both `EmbedForm.jsx` and `ConversationalForm.jsx`.
    * **2025-04-06:** Modified `ConversationalForm.jsx` to keep navigation buttons visible but disabled during loading states.
    * **2025-04-07:** Added an optional 'email' field to the data definitions for both the conversational (`src/utils/form-data.js`) and embed (`src/utils/embed-form-data.js`) forms.
    * **2025-04-07:** Implemented Google Analytics Enhanced Conversions tracking (`gtag('set', 'user_data', ...)`) in `ConversationalForm.jsx` and `EmbedForm.jsx` before the `form_submit` event.
    * **2025-04-07:** Applied `useCallback` and `useMemo` hooks to `EmbedForm.jsx` and `ConversationalForm.jsx` to optimize performance.
    * **2025-04-07:** Fixed multiple `form_submit` event triggers in `EmbedForm.jsx` by making the event conditional on explicit submission.
    * **2025-04-07:** Optimized auto-save logic in `EmbedForm.jsx` with debouncing and dirty state tracking.
    * **2025-04-07:** Corrected `gtag('set', 'user_data', ...)` calls in `EmbedForm.jsx` and `ConversationalForm.jsx` to fire only once per component instance during submission using a `useRef` flag.
    * **2025-04-07:** Addressed `ConversationalForm` performance issues through multiple refactoring steps (context memoization, localized state, callback memoization, functional updates, strict immutable updates, granular props, component isolation).
    * **2025-04-07:** Refactored `PhoneField`, `AddressAutoComplete`, and `ServiceSelect` to remove context dependencies and fix errors.
    * **2025-04-07:** Set default value for `datetime` inputs.
    * **2025-04-07:** Improved email validation immediacy in `validateInputObject`.
    * **2025-04-07:** Corrected phone number validation logic in `validateInputObject`.
    * **2025-04-07:** Re-introduced validation `useEffect` and restored Turnstile integration in `ConversationalForm.jsx`.
    * **2025-04-07:** Reverted CSS rules added to `src/styles.css` and instead applied inline styles (`sx` prop) to the `<Card>` in `ConversationalForm.jsx` to constrain width (min/max/max-content) for chatbox appearance without affecting the embed form.
    * **2025-04-07:** Updated `ConversationalForm.jsx` navigation button behavior: Back button (`handleBackClick`) made always responsive. Next/Submit button (`handleNextSubmitClick`) now shows "Saving, please wait...." alert if `loading` is true (instead of ignoring click), and shows "Securing form..." alert only if `turnstileToken` is null.
    * **2025-04-08:** Modified `ServiceSelect.jsx` to format its output data as `[{value: ..., id: ...}]` before calling `onInputChange`, aligning its data structure with `EmbedForm/Services.jsx`.
    * **2025-04-08:** Refactored `ConversationalForm.jsx` navigation UX: Replaced `Alert` component for loading/Turnstile states with inline `Typography` messages. Updated Next/Submit button `disabled` logic to include `loading` and `!turnstileToken` checks. Removed `navigationWarning` state.
    * **2025-04-09:** Refactored the success message display in `EmbedForm.jsx` to use MUI `Alert` and `Box` components instead of the `Prompt` component, aiming for a more standard UI and better vertical space utilization. Utilized `html-react-parser` for rendering the HTML message content.
    * **2025-04-09:** Implemented smooth scrolling to the success message (`#submission-success`) in `EmbedForm.jsx` using a `useEffect` hook triggered by the `submitted` state.
    * **2026-01-16:** Refactored `StepperForm.jsx` by extracting its internal component definitions into separate files in `src/components/StepperForm/` to improve code maintainability and organization.
