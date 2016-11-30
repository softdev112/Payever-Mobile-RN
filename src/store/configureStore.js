import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import config from '../config';
import moduleRegistry from '../modules';
import AuthApi from '../common/PayeverApi';

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
    api: new AuthApi(config.api, moduleRegistry.api)
  }
}