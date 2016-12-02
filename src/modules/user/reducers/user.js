import { Map } from 'immutable';
import { SET_CURRENT_BUSINESS } from '../actions/user';

const initialState = new Map();

/**
 * Share config through store
 */
export default function businesses(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_BUSINESS: {
      return state.set('currentBusiness', action.data);
    }
    default: {
      return state;
    }
  }
}