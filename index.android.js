import React from 'react';
import startApp from './src/startApp';

// Otherwise we need to import it in each file even if it isn't used directly
global.React = React;

startApp().catch(e => console.error(e));