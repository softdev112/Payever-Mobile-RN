import { Map } from 'immutable';
import config from '../../../config';

const initialState = Map(config);

/**
 * Share config through store
 */
export default function configReducer(state = initialState) {
  return state;
}