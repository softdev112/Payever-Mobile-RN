import { Map } from 'immutable';
import { SET_BUSINESSES } from '../actions/busienesses';

const initialState = new Map();

/**
 * Share config through store
 */
export default function businesses(state = initialState, action) {
  switch(action.type) {
    case SET_BUSINESSES: {
      return new Map(action.data);
    }
    default: {
      return state;
    }
  }
}