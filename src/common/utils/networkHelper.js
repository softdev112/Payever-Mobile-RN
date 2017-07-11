import { log } from './index';
import config from '../../config';

export const NETWORK_ERROR =
  'No Internet connection available.' +
  ' Please check out your connection settings and try again later.';
export const TIMEOUT_ERROR =
  'Sorry! Server is unreachable at the moment. Try again later, please!';

const TIMEOUT: number = config.reqTimeout;
const requestTimers = new Map();

/**
 * Return promise with timeout rejection to implement request with timeout
 *
 * @param timerIdx - key for timeout id in timeout ids Map
 * @param timeout - request timeout 10000ms by default
 * @returns {Promise} - Promise with timeout rejection
 */
async function timeoutPromise(timerIdx, timeout = TIMEOUT) {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout((arg) => {
      reject({ message: arg });
      clearTimer(timerIdx);
    }, timeout, TIMEOUT_ERROR);

    requestTimers.set(timerIdx, timeoutId);
  });
}

/**
 * Clear timeout by timeout key (index) in requestTimers Map
 * @param idx - timout id key
 */
function clearTimer(idx) {
  clearTimeout(requestTimers.get(idx));
  requestTimers.delete(idx);
}

/**
 * Returns new available timer index for storing timeout id
 * @returns {number} new timer index
 */
function getTimerIdx() {
  let timerIdx = requestTimers.size + 1;
  while (requestTimers.has(timerIdx)) timerIdx += 1;

  return timerIdx;
}

export default {
  async isConnected(timeout = TIMEOUT) {
    // TODO: https://github.com/facebook/react-native/issues/8615
    // TODO: always return false so i switch it off for a while
    // if (!await NetInfo.isConnected.fetch()) {
    //    return false;
    // }
    let resp;
    const timerIdx = getTimerIdx();
    try {
      const connectionTestPromise = fetch(config.siteUrl, { method: 'HEAD' });
      resp = await Promise.race(
        [connectionTestPromise, timeoutPromise(timerIdx, timeout)]
      );
    } catch (err) {
      log.info(err);
    } finally {
      clearTimer(timerIdx);
    }

    requestTimers[timerIdx] = null;
    return !!(resp && resp.ok && !resp.error && resp.status === 200);
  },

  async loadFromApi(apiPromise, timeout = TIMEOUT) {
    let resp;
    const timerIdx = getTimerIdx();

    try {
      resp = await Promise.race(
        [apiPromise, timeoutPromise(timerIdx, timeout)]
      );

      if (!resp || !resp.ok || resp.error || resp.status !== 200) {
        const errorMessage = resp.errorDescription || NETWORK_ERROR;
        const error = new Error(errorMessage);
        error.errorName = resp.error;
        throw error;
      }
    } catch (err) {
      log.error(err);
      return { error: err.message || NETWORK_ERROR };
    } finally {
      clearTimer(timerIdx);
    }

    requestTimers[timerIdx] = null;
    return resp && resp.data;
  },

  errorConnection: NETWORK_ERROR,
  errorTimeout: TIMEOUT_ERROR,
};