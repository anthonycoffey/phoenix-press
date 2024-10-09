# PhoenixPress

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-%23117AC9.svg?style=for-the-badge&logo=WordPress&logoColor=white)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)

### Description

Custom WordPress plugin for Phoenix CRM.

### File Download

Check [Releases](https://github.com/anthonycoffey/phoenix-press/releases) for the latest version of the plugin.

### Installation

#### Prerequisites
- Ensure you have `composer` and `npm` installed on your system.
- Install `watchexec` for the `watch-test` task.

#### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/anthonycoffey/phoenix-press.git
   cd phoenix-press
   ```

2. Move the Makefile to parent directory, and install dependencies:
   ```sh
   mv Makefile ..
   cd ..
   make install
   ```

3. Build the project:
   ```sh
   make build
   ```

4. Start the development server:
   ```sh
   make start
   ```

### Available Commands

1. **Install Dependencies**
   ```sh
   make install
   ```
   This command installs PHP dependencies using Composer and JavaScript dependencies using npm.

2. **Build the Project**
   ```sh
   make build
   ```
   This command builds the project using npm.

3. **Start the Development Server**
   ```sh
   make start
   ```
   This command starts the development server using npm.

4. **Create a Release**
   ```sh
   make release
   ```
   This command prepares a release by installing production dependencies, building the project, and creating a zip file excluding `node_modules` and `src` directories.


To build the project and create a release, you would run:
```sh
make build
make release
```