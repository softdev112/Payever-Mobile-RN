import React from 'react';
import { NativeModules } from 'react-native';

NativeModules.RNSound = { IsAndroid: false };
global.React = React;

/* eslint-disable global-require */
jest.mock('mobx-react/native', () => require('mobx-react/custom'))
  .mock('react-native-fetch-blob', () => ({ DocumentDir: '.' }))
  .mock(
    '../src/common/utils/soundHelper/sounds/index.js',
    () => require('../src/common/utils/soundHelper/sounds/__mocks__')
  ).mock('../src/common/utils/soundHelper', () => {});