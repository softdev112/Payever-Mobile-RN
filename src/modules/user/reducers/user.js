import { Map } from 'immutable';
import { SET_CURRENT_PROFILE, SET_PROFILES, SET_MENU } from '../actions/user';

const initialState = new Map({
  currentProfile: null,
  profiles: {},
  menu: new Map()
});

/**
 * Share config through store
 */
export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_PROFILE: {
      return state.set('currentProfile', action.data);
    }
    case SET_PROFILES: {
      return state.set('profiles', action.data);
    }
    case SET_MENU: {
      return state.setIn(['menu', action.profileId], action.data);
    }
    default: {
      return state;
    }
  }
}