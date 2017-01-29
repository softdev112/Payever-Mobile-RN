import React from 'react';

global.React = React;

/* eslint-disable global-require */
jest.mock('mobx-react/native', () => require('mobx-react/custom'));