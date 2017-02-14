import { runInAction } from 'mobx';
import * as log from '../log';
import { isConnected, loadFromApi, NETWORK_ERROR } from './network';
import { isCacheUpToDate, loadFromCache, saveToCache } from './cache';

/**
 * This helper simplifies API call from Store
 */
export default class ApiHelper {
  apiPromise: Promise<ApiResp>;
  fetchPromise: Promise;
  returnValue: any;
  store: ?Object = null;

  cacheId: string = null;
  cacheLifetime: number = 0;
  timeout: number = 7000;

  onSuccess: (data: Object) => any;
  onError: (error: string) => any;
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
  success(callback: (data: Object) => any): ApiHelper {
    this.startFetch();
    this.onSuccess = callback;
    return this;
  }

  /**
   * Call this callback if API promise has been rejected or an error occurred
   * Returned value is saved and can be returned in a promise through promise()
   */
  error(callback: (error: string) => any): ApiHelper {
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

  cache(cacheId, options: CacheOptions = {}) {
    this.cacheId = cacheId;

    if (options.lifetime) {
      this.cacheLifetime = options.lifetime;
    }

    if (options.timeout) {
      this.timeout = options.timeout;
    }

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
    this.startFetch();
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
   * @private
   */
  startFetch() {
    if (!this.fetchPromise) {
      this.fetchPromise = this.fetch().catch(log.error);
    }
  }

  /**
   * Set error and isLoading fields of a store (if the store is passed)
   */
  setState({ error, isLoading }) {
    if (!this.store) {
      return;
    }

    if (this.store.error !== undefined && error !== undefined) {
      this.store.error = error;
    }

    if (this.store.isLoading !== undefined && isLoading !== undefined) {
      this.store.isLoading = isLoading;
    }
  }

  /**
   * Execute API promise. Here is main helper logic.
   * @protected
   */
  async fetch() {
    this.setState({ error: '', isLoading: true });

    const { data, error } = await loadData(
      this.apiPromise,
      this.cacheId,
      this.cacheLifetime,
      this.timeout
    );

    if (data) {
      this.execHandler(() => this.onSuccess(data));
    } else {
      this.execHandler(() => {
        this.setState({ error });
        return this.onError({ error });
      });

      if (this.returnValue === undefined) {
        this.returnValue = false;
      }
    }

    this.execHandler(() => this.onComplete(data, error));
    runInAction(() => {
      this.setState({ isLoading: false });
    });

    return this.returnValue !== undefined ? this.returnValue : true;
  }
}

async function loadData(apiPromise, cacheId, lifeTime, timeout) {
  let cacheWasUsed = false;
  let data;
  let error;

  // Try to load cache if a value isn't expired
  if (cacheId && isCacheUpToDate(cacheId, lifeTime)) {
    data = await loadFromCache(cacheId);
    cacheWasUsed = true;
  }

  // Try to load from API
  if (!data && await isConnected()) {
    try {
      data = await loadFromApi(apiPromise, timeout);
      if (data && cacheId) {
        saveToCache(cacheId, lifeTime, data);
      }
    } catch (e) {
      error = e.message;
      log.warn(e + (e.errorName ? ` (${e.errorName})` : ''));
    }
  }

  // If there is still no data try to load cache even if it's expired
  if (cacheId && !data && !cacheWasUsed) {
    data = await loadFromCache(cacheId);
  }

  if (!data && !error) {
    error = NETWORK_ERROR;
  }

  return { data, error };
}

type CacheOptions = {
  lifetime: number;
  timeout: number;
};