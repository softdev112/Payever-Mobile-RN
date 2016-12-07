import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import config from '../config';
import moduleRegistry from '../modules';
import PayeverApi from '../common/api';

const middlewares = [thunk.withExtraArgument(createThunkArgs())];

if (__DEV__) {
  middlewares.push(createLogger({
    level: 'info',
    collapsed: true
  }));
}

const reducer = combineReducers(moduleRegistry.reducers);

export default function configureStore(initialState) {
  return createStore(reducer, initialState, applyMiddleware(...middlewares));
}

function createThunkArgs() {
  return {
    api: new PayeverApi(config.api)
  }
}