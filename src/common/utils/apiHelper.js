import { runInAction } from 'mobx';
import * as log from './log';

export class ApiHelper {
  apiPromise: Promise<ApiResp>;
  fetchPromise: Promise;
  returnValue: any;
  store: ?Object = null;

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

  success(callback: (resp: ApiResp) => any): ApiHelper {
    this.onSuccess = callback;
    return this;
  }

  error(callback: (resp: ErrorObject) => any): ApiHelper {
    this.onError = callback;
    return this;
  }

  complete(callback: () => any): ApiHelper {
    this.onComplete = callback;
    return this;
  }

  promise() {
    return this.fetchPromise;
  }

  /**
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

  async fetch() {
    if (this.store) {
      this.store.error = '';
    }

    let resp;

    try {
      resp = await this.apiPromise;

      if (resp.ok && !resp.error) {
        this.execHandler(() => this.onSuccess(resp));
      } else {
        //noinspection ExceptionCaughtLocallyJS
        throw new Error(resp.errorDescription);
      }
    } catch (e) {
      const error = resp ? resp.error : 'api_exception';
      const errorDescription = e.message;

      this.execHandler(() => {
        if (this.store) {
          this.store.error = errorDescription;
        }
        return this.onError({ error, errorDescription });
      });

      log.warn(`${error} ${errorDescription}`);
    }

    this.execHandler(() => this.onComplete(resp));

    return this.returnValue !== undefined ? this.returnValue : true;
  }
}

export default function apiHelper(apiPromise: Promise<ApiResp>,
  store: Object = null): ApiHelper {
  const helper = new ApiHelper(apiPromise, store);
  this.fetchPromise = helper.fetch().catch(log.error);
  return helper;
}

export type ErrorObject = {
  error: string;
  errorDescription: string;
};