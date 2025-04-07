# Active Context

* **Current Focus:** Restoring Google Analytics `gtag` event tracking (`form_start`, `form_submit`) to the React form components.
* **Recent Changes:** 
    * Added `gtag('event', 'form_start')` and `gtag('event', 'form_submit')` calls to `src/components/EmbedForm.jsx`.
    * Added `gtag('event', 'form_start')` and `gtag('event', 'form_submit')` calls to `src/components/ConversationalForm.jsx`.
* **Next Steps:** Update `progress.md` to reflect the restored functionality. Verify tracking implementation.
* **Active Decisions:** 
    * Restored specific `gtag` logic based on previously removed code provided by the user.
    * Placed `form_start` event trigger on initial form submission attempt (before `formSubmissionId` is set).
    * Placed `form_submit` event trigger after successful API submission (PUT or POST) in both forms.
* **Key Patterns/Preferences:** 
    * WordPress plugin structure.
    * PHP for backend/WordPress integration.
    * React (with MUI) for frontend components.
    * `@wordpress/scripts` for build tooling.
    * `Makefile` for orchestrating development tasks (install, start, build).
* **Learnings/Insights:** Gained initial understanding of the project's purpose, core technologies, and development setup from `README.md` and `package.json`.
