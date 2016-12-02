import { Map } from 'immutable';
import * as actions from '../actions/auth';

const initialState = Map({
  loggedIn: false,
  error: '',
  accessToken: null,
  refreshToken: null,
  expiresIn: null
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SIGN_IN_FAILED: {
      return state.set('error', action.error);
    }
    case actions.SIGN_IN: {
      return state.merge(action.data, { loggedIn: true });
    }
    default: {
      return state;
    }
  }
}