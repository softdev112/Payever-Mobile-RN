export const NETWORK_ERROR = 'Sorry, a payever server isn\'t responsible. ' +
  'Please try again later.';

export async function isConnected() {
  return true;
}

export async function loadFromApi(apiPromise, timeout) {
  const resp = await Promise.race([apiPromise, timeoutPromise(timeout)]);
  if (!resp.ok || resp.error) {
    const errorMessage = resp.errorDescription || NETWORK_ERROR;
    const error = new Error(errorMessage);
    error.errorName = resp.error;
    throw error;
  }
  return resp.data;
}

async function timeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(reject, timeout, NETWORK_ERROR);
  });
}