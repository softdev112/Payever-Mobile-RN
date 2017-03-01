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

## Useful information

### Logging

If you want to read logs using more convenient tool than log-android/ios
install [log-s-desktop](https://github.com/megahertz/log-s-desktop)

    git clone git@github.com:megahertz/log-s-desktop.git
    cd log-s-desktop
    npm i
    npm start

Then configure payever-mobile to use this log server in
src/config/local.js:

    export default {
      debug: {
        consoleLevel: 'silly',
        logApiCall: 1,
        logMobx: 0,
        logSLevel: 'silly',
        logSUrl: 'http://192.168.1.2:8085/log',
        logWampCall: 1,
      },
    };

where 192.168.1.2 is your working station ip address (which is
accessible from simulator/device). Please be aware that local.js is
loaded only for dev environment (when dev.js config is active)

## Build tools

### Increase version:

    npm run bump

### Release publishing

- Make an internal release, publish to fabric.io and send a notification
to payever MOBILE and DESKTOP telegram chat
`npm run beta`
or make a release for developers ony without notification:
`npm run beta:dev`

For more options see [Fastlane readme](blob/master/fastlane/README.md)

### Rebuild vector icons

    gulp svg