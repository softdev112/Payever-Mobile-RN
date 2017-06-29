import { log } from './index';
import config from '../../config';

export const NETWORK_ERROR =
  'No Internet connection available.' +
  ' Please check out your connection settings and try again later.';
const TIMEOUT: number = 7000;
const requestTimers = [];

async function timeoutPromise(timerIdx, timeout = TIMEOUT) {
  return new Promise((_, reject) => {
    requestTimers[timerIdx] = setTimeout((arg) => {
      requestTimers[timerIdx] = null;
      reject(arg);
    }, timeout, NETWORK_ERROR);
  });
}

export default {
  async isConnected() {
    // TODO: https://github.com/facebook/react-native/issues/8615
    // TODO: always return false so i switch it off for a while
    // if (!await NetInfo.isConnected.fetch()) {
    //    return false;
    // }
    let resp;
    const timerIdx = requestTimers.length;
    try {
      const connectionTestPromise = fetch(config.siteUrl, { method: 'HEAD' });
      resp = await Promise.race(
        [connectionTestPromise, timeoutPromise(timerIdx)]
      );
      clearTimeout(requestTimers[timerIdx]);
    } catch (err) {
      log.info(err);
    }

    requestTimers[timerIdx] = null;
    return resp && resp.ok && !resp.error && resp.status === 200;
  },

  async loadFromApi(apiPromise, timeout = TIMEOUT) {
    let resp;
    const timerIdx = requestTimers.length;
    try {
      resp = await Promise.race(
        [apiPromise, timeoutPromise(timerIdx, timeout)]
      );
      clearTimeout(requestTimers[timerIdx]);

      if (!resp || !resp.ok || resp.error || resp.status !== 200) {
        const errorMessage = resp.errorDescription || NETWORK_ERROR;
        const error = new Error(errorMessage);
        error.errorName = resp.error;
        throw error;
      }
    } catch (err) {
      log.error(err);
    }

    requestTimers[timerIdx] = null;
    return resp && resp.data;
  },

  errorMessage: NETWORK_ERROR,
};