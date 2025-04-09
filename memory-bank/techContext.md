# Tech Context

* **Core Technologies:**
    * **Backend:** PHP (>= 7.4.3)
    * **Frontend:** JavaScript (ES6+), React (v18+), MUI (v6+), Emotion, SASS/CSS
    * **WordPress Integration:** WordPress Plugin API, `@wordpress/element`, `@wordpress/scripts`
* **Development Environment:**
    * `php` >= 7.4.3
    * `composer` (for PHP dependencies like `10up/wp_mock` for testing)
    * `npm` (for JS dependencies and running scripts)
    * Local WordPress installation
* **Build/Deployment Process:**
    * **Installation:** `make install` (runs `composer install` and `npm install`)
    * **Development:** `make start` (runs `wp-scripts start` via `npm start`) - Starts a development server with hot-reloading.
    * **Production Build:** `make build` (runs `wp-scripts build` via `npm run build`) - Creates optimized assets in the `build/` directory.
    * **Packaging:** `npm run release` (runs `wp-scripts plugin-zip`) - Creates a distributable zip file of the plugin.
    * **Build Tool:** Webpack (configured via `webpack.config.js` and managed by `@wordpress/scripts`). Uses Babel for JS transpilation, MiniCssExtractPlugin for CSS.
* **Key Dependencies:**
    * **PHP:** `10up/wp_mock` (dev dependency for unit testing)
    * **JS:** `react`, `react-dom`, `@mui/material`, `@emotion/react`, `axios`, `@wordpress/element`, `@wordpress/scripts`, `date-fns`, `gtag.js`
    * **External Services:** Phoenix CRM API (URL configured in settings), Google Maps API (Key configured in settings), Google Tag Manager (gtag.js)
* **Technical Constraints:**
    * Requires WordPress environment.
    * PHP version constraint (>= 7.4.3).
    * Browser support defined by `browserslist` in `package.json` ("> 1%", "last 2 versions", "not dead", "not ie 11").
* **Tooling:**
    * **Package Managers:** `composer`, `npm`
    * **Build System:** `@wordpress/scripts` (Webpack wrapper), `Makefile`
    * **Formatting:** `wp-scripts format` (likely Prettier), `phpcbf` (PHP Code Beautifier and Fixer)
    * **Testing:** `phpunit` (via `composer test:unit`)
    * **Bundler:** Webpack
    * **Transpiler:** Babel
