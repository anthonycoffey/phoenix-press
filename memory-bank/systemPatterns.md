# System Patterns

* **Architecture Overview:** Standard WordPress Plugin architecture. Consists of a PHP backend for WordPress integration (settings, hooks, potentially API endpoints) and a JavaScript (React) frontend for dynamic UI components.
* **Key Technical Decisions:** 
    * Leveraging WordPress plugin framework.
    * Using PHP for server-side logic and WordPress integration.
    * Employing React with MUI for building frontend components.
    * Utilizing `@wordpress/scripts` for the build process.
* **Design Patterns:** 
    * WordPress Hooks (Actions/Filters) for backend integration.
    * Component-Based Architecture (React) for the frontend.
    * Likely uses PHP Classes for organizing backend logic (e.g., `includes/Api.php`, `includes/Settings.php`).
    * Analytics tracking via gtag() for form interactions (form_start, form_submit events).
* **Component Relationships:**
    * PHP Backend (`includes/*.php`): Manages WordPress settings, registers assets (CSS/JS), potentially provides REST API endpoints for the frontend. Interacts with the WordPress database for settings.
    * Frontend (`src/`): React components render UI elements (likely forms or displays related to Phoenix CRM). Uses `axios` to communicate with the Phoenix CRM API (via URL configured in settings) and potentially custom PHP endpoints.
* **Critical Implementation Paths:** 
    * Saving and retrieving settings from the WordPress admin page.
    * Loading and initializing React components on the frontend.
    * Data exchange between React components and the Phoenix CRM API.
    * Analytics event tracking for form interactions via gtag().
* **Data Flow:**
    * **Settings:** WP Admin UI -> PHP Backend -> WordPress Database (`wp_options` table). Settings are read by PHP backend as needed.
    * **Frontend Interaction (Example: Form Submission):** User Input -> React Component State -> `axios` POST request -> Phoenix CRM API / Custom PHP Endpoint.
