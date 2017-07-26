import { runInAction } from 'mobx';
import { Navigation } from 'react-native-navigation';
import { cacheHelper, log, networkHelper } from '../index';

/**
 * This helper simplifies API call from Store
 */
export default class ApiHelper {
  apiEndPoint: Function;
  showErrorPage: boolean;
  fetchPromise: Promise;
  returnValue: any;
  stateObject: ?Object = null;

  cacheId: string = null;
  cacheLifetime: number = 0;
  timeout: number = 7000;
  noCache: boolean = false;

  onSuccess: (data: Object) => any;
  onError: (error: string) => any;
  onComplete: () => any;

  constructor(
    apiEndPoint: Function,
    stateObject: Object = null,
    showErrorPage: boolean = true
  ) {
    this.apiEndPoint = apiEndPoint;
    this.stateObject = stateObject;
    this.showErrorPage = showErrorPage;

    this.onSuccess  = () => {};
    this.onError    = () => {};
    this.onComplete = () => {};
  }

  /**
   * Call this callback if API promise has been resolved
   * Returned value is saved and can be returned in a promise through promise()
   */
  success(callback: (data: Object) => any = () => {}): ApiHelper {
    this.startFetch();
    this.onSuccess = callback;
    return this;
  }

  /**
   * Call this callback if API promise has been rejected or an error occurred
   * Returned value is saved and can be returned in a promise through promise()
   */
  error(callback: (error: string) => any = () => {}): ApiHelper {
    this.onError = callback;
    return this;
  }

  /**
   * Call this callback if API promise has been rejected or an error occurred
   * If the callback returns a value it'll overwrite a value returned from
   * success or error callback.
   */
  complete(callback: () => any = () => {}): ApiHelper {
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

    if (options.noCache) {
      this.noCache = options.noCache;
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
   * Set error and isLoading fields of a stateObject
   */
  setState({ error, isLoading }) {
    if (!this.stateObject) {
      return;
    }

    if (error !== undefined) {
      this.stateObject.error = error;
    }

    if (isLoading !== undefined) {
      this.stateObject.isLoading = isLoading;
    }
  }

  /**
   * Execute API promise. Here is main helper logic.
   * @protected
   */
  async fetch() {
    this.setState({ error: '', isLoading: true });

    const { data, error } = await loadData(
      this.apiEndPoint,
      this.cacheId,
      this.cacheLifetime,
      this.timeout,
      this.noCache,
      this.showErrorPage
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

async function loadData(
  apiEndPoint,
  cacheId,
  lifeTime,
  timeout,
  noCache,
  showErrorPage
) {
  let data;
  const isConnected = await networkHelper.isConnected();

  // Load data from cache if noCache !== true
  if (!noCache && cacheId) {
    data = await cacheHelper.loadFromCache(cacheId);

    if ((data && cacheHelper.isCacheUpToDate(cacheId, lifeTime))
      || !isConnected) {
      return {
        data,
        error: '',
      };
    }
  }

  // Load from API and update data in cache if connected
  if (isConnected) {
    try {
      data = await networkHelper.loadFromApi(apiEndPoint(), timeout);

      if (!data || data.error) {
        throw new Error(
          data && data.error ? data.error : networkHelper.errorTimeout
        );
      }

      if (cacheId) {
        cacheHelper.saveToCache(cacheId, lifeTime, data);
      }
    } catch (e) {
      log.warn(e + (e.errorName ? ` (${e.errorName})` : ''));
      return { error: e.message || networkHelper.errorConnection };
    }
  } else if (showErrorPage) {
    Navigation.showModal({
      screen: 'core.ErrorPage',
      passProps: {
        message: networkHelper.errorConnection,
        onBack: Navigation.dismissModal.bind(null, { animated: true }),
      },
    });
  }

  return {
    data,
    error: data ? '' : networkHelper.errorConnection,
  };
}

type CacheOptions = {
  lifetime: number;
  timeout: number;
  noCache: boolean;
};