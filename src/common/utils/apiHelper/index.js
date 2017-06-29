import ApiHelper from './ApiHelper';

/**
 * This helper simplifies API call from Store
 * If stateObject is passed this helper will set isLoading and erro fields
 * of this object
 * @param {Function} apiEndPoint
 * @param {Boolean} [showErrorPage]
 * @param {Object} [stateObject]
 * @return {ApiHelper}
 */
export default function apiHelper(
  apiEndPoint: Function,
  stateObject: Object = null,
  showErrorPage: boolean = true
): ApiHelper {
  return new ApiHelper(apiEndPoint, stateObject, showErrorPage);
}