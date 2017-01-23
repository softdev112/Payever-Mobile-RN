import { runInAction } from 'mobx';
import { AsyncStorage, NetInfo } from 'react-native';
import * as log from './log';

const NETWORK_ERROR = 'Sorry, payever server is not responsible. ' +
  'Please try again later.';

/**
 * This helper simplifies API call from Store
 */
export class ApiHelper {
  apiPromise: Promise<ApiResp>;
  fetchPromise: Promise;
  returnValue: any;
  store: ?Object = null;
  cacheKey: string = null;

  onSuccess: (resp: ApiResp) => any;
  onError: (e: ErrorObject) => any;
  onComplete: () => any;

  constructor(apiPromise: Promise<ApiResp>, store: Object = null) {
    this.apiPromise = apiPromise;
    this.store = store;

    this.onSuccess  = () => {};
    this.onError    = () => {};
    this.onComplete = () => {};
  }

  /**
   * Call this callback if API promise has been resolved
   * Returned value is saved and can be returned in a promise through promise()
   */
  success(callback: (resp: ApiResp) => any): ApiHelper {
    this.onSuccess = callback;
    return this;
  }

  /**
   * Call this callback if API promise has been rejected or an error occurred
   * Returned value is saved and can be returned in a promise through promise()
   */
  error(callback: (resp: ErrorObject) => any): ApiHelper {
    this.onError = callback;
    return this;
  }

  /**
   * Call this callback if API promise has been rejected or an error occurred
   * If the callback returns a value it'll overwrite a value returned from
   * success or error callback.
   */
  complete(callback: () => any): ApiHelper {
    this.onComplete = callback;
    return this;
  }

  cache(key) {
    this.cacheKey = 'cache:' + key;
    return this;
  }

  /**
   * If success, error or complete handler returns a value, promise will be
   * resolved to it.
   * Otherwise boolean will be returned if no errors.
   * This promise will be always resolved even if error occurred.
   * @return {Promise}
   */
  promise() {
    return this.fetchPromise;
  }

  /**
   * Execute a handler inside runInAction and save returned result for promise()
   * @private
   */
  execHandler(callback: Function) {
    runInAction(() => {
      const result = callback();
      if (result !== undefined) {
        this.returnValue = result;
      }
    });
  }

  /**
   * Execute API promise. Here is main helper logic.
   * @protected
   */
  async fetch() {
    if (this.store) {
      if (this.store.error !== undefined) {
        this.store.error = '';
      }
      if (this.store.isLoading !== undefined) {
        this.store.isLoading = true;
      }
    }

    let resp;

    try {
      resp = await offlinePromise(this.apiPromise, this.cacheKey);

      if (resp.ok && !resp.error) {
        if (this.cacheKey) {
          saveToStorage(this.cacheKey, resp.data);
        }
        this.execHandler(() => this.onSuccess(resp));
      } else {
        //noinspection ExceptionCaughtLocallyJS
        throw new Error(resp.errorDescription);
      }
    } catch (e) {
      const error = resp ? resp.error : 'api_exception';
      const errorDescription = e.message;
      console.log(e);

      this.execHandler(() => {
        if (this.store && this.store.error !== undefined) {
          this.store.error = errorDescription;
        }
        return this.onError({ error, errorDescription });
      });

      if (!resp) {
        log.warn(`${error} ${errorDescription}`);
      }

      if (this.returnValue === undefined) {
        this.returnValue = false;
      }
    }

    this.execHandler(() => this.onComplete(resp));
    runInAction(() => {
      if (this.store && this.store.isLoading !== undefined) {
        this.store.isLoading = false;
      }
    });

    return this.returnValue !== undefined ? this.returnValue : true;
  }
}


export default function apiHelper(
  apiPromise: Promise<ApiResp>,
  store: Object = null
): ApiHelper {
  const helper = new ApiHelper(apiPromise, store);
  helper.fetchPromise = helper.fetch().catch(log.error);
  return helper;
}

function offlinePromise(sourcePromise: Promise, cacheKey: string) {
  const TIMEOUT = 7000;
  let isTimeout = false;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      isTimeout = true;
      loadFromStorage(cacheKey, resolve, reject);
    }, TIMEOUT);

    sourcePromise
      .then((result) => {
        if (!isTimeout) {
          clearTimeout(timeoutId);
          resolve(result);
        }
      })
      .catch(log.warn);

    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        return;
      }

      clearTimeout(timeoutId);
      isTimeout = true;
      loadFromStorage(cacheKey, resolve, reject);
    });
  });
}

function loadFromStorage(cacheKey, resolve, reject) {
  if (!cacheKey) {
    reject(new Error(NETWORK_ERROR));
    return;
  }
  AsyncStorage.getItem(cacheKey)
    .then((result => {
      if (result !== null) {
        resolve(new Response(JSON.stringify(result)));
      } else {
        reject(new Error(NETWORK_ERROR));
      }
    }))
    .catch(reject);
}

function saveToStorage(cacheKey, data) {
  AsyncStorage.setItem(cacheKey, JSON.stringify(data)).catch(log.error);
}

export type ErrorObject = {
  error: string;
  errorDescription: string;
};