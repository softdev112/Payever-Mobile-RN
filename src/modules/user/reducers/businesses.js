import { List } from 'immutable';
import { GET_BUSINESSES } from '../actions/busienesses';

const initialState = new List();

/**
 * Share config through store
 */
export default function businesses(state = initialState, action) {
  switch(action.type) {
    case GET_BUSINESSES: {
      return new List(action.data);
    }
    default: {
      return state;
    }
  }
}