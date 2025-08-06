# Build Instructions for Android APK

Follow these steps to build the Android APK for this project.

## Prerequisites

1.  **Node.js and npm:** Make sure you have Node.js and npm installed.
2.  **Android Studio:** You must have Android Studio installed and configured correctly. This includes the Android SDK and command-line tools.
3.  **Java Development Kit (JDK):** A recent version of the JDK is required.

## Build Steps

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Build the Web App:**
    Create the production build of the React app. This will generate the `dist` folder.
    ```bash
    npm run build
    ```

3.  **Sync with Capacitor:**
    Sync the web build with the Android project.
    ```bash
    npx cap sync android
    ```

4.  **Open in Android Studio:**
    Open the Android project in Android Studio.
    ```bash
    npx cap open android
    ```

5.  **Build the APK in Android Studio:**
    - In Android Studio, wait for the project to sync and build.
    - Go to `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
    - Once the build is complete, you will see a notification. Click on "locate" to find the generated `app-debug.apk` file in `android/app/build/outputs/apk/debug/`.

## Generating a Release Build (for Google Play Store)

To generate a signed, release-ready APK, you will need to follow the official Android documentation for signing your app. This involves creating a keystore and updating your `build.gradle` file.

Refer to the official Capacitor documentation for more details: [https://capacitorjs.com/docs/android](https://capacitorjs.com/docs/android)
