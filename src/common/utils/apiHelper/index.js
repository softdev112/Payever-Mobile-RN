import ApiHelper from './ApiHelper';

export default function apiHelper(
  apiPromise: Promise<ApiResp>,
  store: Object = null
): ApiHelper {
  return new ApiHelper(apiPromise, store);
}