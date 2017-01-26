import { NetInfo } from 'react-native';

export const NETWORK_ERROR = 'Sorry, a payever server isn\'t responsible. ' +
  'Please try again later.';

export async function isConnected() {
  return NetInfo.isConnected.fetch();
}

export async function loadFromApi(apiPromise, timeout) {
  const resp = await Promise.race([apiPromise, timeoutPromise(timeout)]);
  if (!resp.ok || resp.error) {
    let errorMessage = resp.errorDescription || NETWORK_ERROR;
    if (resp.error) {
      errorMessage += ` (${resp.error})`;
    }
    throw new Error(errorMessage);
  }
  return resp.data;
}

async function timeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(reject, timeout, NETWORK_ERROR);
  });
}