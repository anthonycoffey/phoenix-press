# PhoenixPress

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)

### Description

Custom WordPress plugin for Phoenix CRM.

### Plugin Settings

Activating this plugin enables a few settings in the WordPress admin area under `Settings`. These settings are used to configure the plugin and are stored in the WordPress database.

- Google Maps API Key
- Phoenix API URL
- SMS Consent Message
- Disclaimer Message
- Submission Message

*Note: If the plugin is deactivated and removed, the plugin settings will remain. However, for a fresh install of WordPress these settings will need to be configured accordingly.*

![readme-plugin-settings.png](readme-plugin-settings.png)

### Releases

Check Releases page to download the latest version of the plugin.

### Contributing

#### Prerequisites
- `composer` and `npm` installed on your system.
- `PHP` version 7.4.3 or higher.

#### Steps
1. Clone the repository to your local WordPress install in the `wp-content/plugins` directory:

2. Create additional composer.json file for parent `plugins` directory and paste the following contents in it:
   ```JSON
   {
      "name": "phoenix/press",
      "type": "wordpress-plugin",
      "require-dev": {
         "10up/wp_mock": "^1.0"
      },
      "require": {
         "php": "^7.4.3 || ^8"
      },
      "scripts": {
         "test": "composer test:unit",
         "test:unit": "phpunit -c phpunit.xml",
         "fixes": "phpcbf php/ && phpcbf tests/"
      }
   }
   ```
   
3. Move the Makefile to parent directory, and install dependencies:
   ```sh
   mv Makefile ..
   cd ..
   make install
   ```

4. Build the project:
   ```sh
   make build
   ```

5. Start the development server:
   ```sh
   make start
   ```

#### Available Commands

1. **Install Dependencies**

   This command installs PHP dependencies using Composer and JavaScript dependencies using npm.
   ```sh
   make install
   ```

2. **Start the Development Server**

   This command starts the development server using npm.
   ```sh
   make start
   ```

3. **Build the Project**

   This command builds the project using npm.
   ```sh
   make build
   ```
