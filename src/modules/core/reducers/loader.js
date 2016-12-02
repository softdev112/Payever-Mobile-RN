import { Map } from 'immutable';
import { SHOW_LOADER, HIDE_LOADER } from '../actions/loader';

const initialState = Map({
  isLoading: false
});

/**
 * Share config through store
 */
export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER: {
      return state.set('isLoading', true);
    }
    case HIDE_LOADER: {
      return state.set('isLoading', false);
    }
    default: {
      return state;
    }
  }
}