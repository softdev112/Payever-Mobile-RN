# payever-mobile-rn

## Install a development version

1. Install Android SDK or Xcode (depending on a target platform). For
    more info see [Getting Started ](https://facebook.github.io/react-native/docs/getting-started.html)
    section.

2. Install [Node.js](http://nodejs.org)

    * on OSX use [homebrew](http://brew.sh) `brew install node`
    * on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`
    * on Debian based linux use `apt-get install nodejs npm`
    
3. Install react-native

    npm install -g react-native-cli
    
4. Go to the root folder
    ```
    cd payever-mobile-rn
    ```

5. Install local NPM dependence:
    ```
    npm install
    ```

6. Start the application
    ```
    react-native run-android
    ```
    or
    ```
    react-native run-ios
    ```    

7. If the app is not connected to live server, run `npm start`

## Style Guide

 - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
 - [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

## Build tools

### Increase version:

    npm run bump

### Release publishing

- Make an internal build for members in developers group:
`fastlane beta dev:true`
or shortcut (with automatic version increasing):
`npm run beta`

- Build for all members with telegram notification:
`fastlane beta`

### Rebuild vector icons

    gulp svg

## Useful information:
 
### Show In-App Debug menu in the latest android emulator:

Ctrl(Cmd)+M