import ApiHelper from './ApiHelper';

/**
 * This helper simplifies API call from Store
 * If stateObject is passed this helper will set isLoading and erro fields
 * of this object
 * @param {Promise<ApiResp>} apiPromise
 * @param {Object} [stateObject]
 * @return {ApiHelper}
 */
export default function apiHelper(
  apiPromise: Promise<ApiResp>,
  stateObject: Object = null
): ApiHelper {
  return new ApiHelper(apiPromise, stateObject);
}