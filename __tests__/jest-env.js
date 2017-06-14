import React from 'react';
import { NativeModules } from 'react-native';

NativeModules.RNSound = { IsAndroid: false };
global.React = React;

// eslint-disable-next-line global-require
jest.mock('mobx-react/native', () => require('mobx-react/custom'))
  .mock('../src/common/utils/soundHelper');