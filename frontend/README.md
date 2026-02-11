README NOT FINISHED/NOT TESTED

## Prerequisites:
- Node js - visit https://nodejs.org/en to install.
- Android studio (optional, for the android emulator, only for windows)
- XCode (optional, for the ios emulator, only for mac)
- Expo go (optional, to run the app on your mobile device

## Emulation:
If you want to emulate this using Android Studio, make sure you update your environment variables.
- In the start, search for "environment variables", it should show "edit the system environment variables"
- Click on "environment variables"
- Add a new system variable, name="ANDROID_HOME", path="C:\Users\YOUR_NAME\AppData\Local\Android\Sdk" (path should be wherever the path to your \Android\Sdk folder is... default is in AppData)
- In the user variables, edit the path variable, add "%ANDROID_HOME%\platform-tools" and "%ANDROID_HOME%\emulator"

For XCode, nothing else is required except just the XCode app.

## Running the App:
Once the repository is cloned, cd into the frontend directory.
Run "npm install", to install missing dependencies.
Run "npx expo start", to start the app.

From there, you are given options for the app:
press "a" to launch the android emulator
press "i" to launch the ios emulator
press "w" to launch the web server emulator
