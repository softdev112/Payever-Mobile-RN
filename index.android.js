import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';

// Otherwise we need to import it in each file even if it isn't used directly
global.React = React;

AppRegistry.registerComponent('PayeverMobile', () => App);