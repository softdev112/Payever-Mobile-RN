/* eslint-disable quote-props */
/** @name ApiResp */
import { log } from 'utils';

import type AuthStore from '../../store/auth';
import type { Config } from '../../config';

import AuthApi from './AuthApi';
import BusinessApi from './BusinessApi';
import DashboardApi from './DashboardApi';
import DeviceApi from './DeviceApi';
import MarketingApi from './MarketingApi';
import MenuApi from './MenuApi';
import MessengerApi from './MessengerApi';
import ProfilesApi from './ProfilesApi';
import UserApi from './UserApi';

export default class PayeverApi {
  auth: AuthApi           = new AuthApi(this);
  business: BusinessApi   = new BusinessApi(this);
  dashboard: DashboardApi = new DashboardApi(this);
  device: DeviceApi       = new DeviceApi(this);
  marketing: MarketingApi = new MarketingApi(this);
  menu: MenuApi           = new MenuApi(this);
  messenger: MessengerApi = new MessengerApi(this);
  profiles: ProfilesApi   = new ProfilesApi(this);
  user: UserApi           = new UserApi(this);

  baseUrl: string;
  clientId: string;
  clientSecret: string;
  logApiCall: boolean;

  authStore: AuthStore;
  config: Config;

  constructor(config: Config, authStore: AuthStore) {
    Object.assign(this, config.api);

    this.config     = config;
    this.authStore  = authStore;
    this.logApiCall = config.debug.logApiCall;
  }

  async get(url: string, query: Object = null): Promise<ApiResp> {
    query = {
      ...query,
      access_token: await this.authStore.getAccessToken(),
    };
    return this.fetch(url, { query });
  }

  async post(
    url: string,
    data: Object = null,
    options: RequestOptions = {}
  ): Promise<ApiResp> {
    const isJson = options.format === 'json';
    delete options.format;

    const headers = {
      'Accept':        'application/json',
      'Authorization': 'Bearer ' + await this.authStore.getAccessToken(),
      'Content-Type':  isJson ? 'application/json' : 'multipart/form-data',
    };

    return this.fetch(url, {
      body: isJson ? JSON.stringify(data) : objectToFormData(data),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      cache: 'default',
      ...options,
      headers: { ...headers, ...options.headers },
    });
  }

  //noinspection ReservedWordAsName
  async delete(
    url: string,
    data: Object = null,
    options: RequestOptions = {}
  ): Promise<ApiResp> {
    return this.post(url, data, { ...options, method: 'DELETE' });
  }

  //noinspection InfiniteRecursionJS
  async fetch(url: string, options: Object = {}): Promise<ApiResp> {
    options.method = options.method || 'GET';
    url = this.normalizeUrl(url, options.query);

    if (__DEV__ && this.logApiCall) {
      log.debug(`${options.method} ${url}`);
    }

    const response: ApiResp = await fetch(url, options);
    const text = await response.text();
    try {
      response.data = JSON.parse(text);
      if (response.data && response.data.error) {
        response.error = response.data.error;
        //noinspection JSUnresolvedVariable
        response.errorDescription = response.data.error_description;
      }
    } catch (e) {
      response.data = {};
      response.error = 'json_error';
      response.errorDescription = 'Server sent invalid json data.';
    }

    if (__DEV__ && this.logApiCall) {
      log.debug('Response data ', response.data);
    }

    return response;
  }

  normalizeUrl(url: string, query: Object = null) {
    let fullUrl = this.baseUrl + url;
    if (query && Object.keys(query).length) {
      fullUrl += '?' + objectToQueryString(query);
    }
    return fullUrl;
  }
}

function objectToQueryString(data: Object): string {
  return Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');
}

function objectToFormData(data: Object) {
  const formData = new FormData();

  if (!data || typeof data !== 'object') return formData;

  const typeDetector = Object.prototype.toString;
  const keys = Object.keys(data);

  function appendValueToFormData(currentName, value) {
    switch (typeDetector.call(value)) {
      case '[object Object]': {
        const objKeys = Object.keys(value);
        objKeys.forEach(key =>
          appendValueToFormData(`${currentName}[${key}]`, value[key]));
        break;
      }

      case '[object Array]':
        value.forEach(element =>
          appendValueToFormData(`${currentName}[]`, element));
        break;

      default:
        formData.append(currentName, value);
        break;
    }
  }

  try {
    keys.forEach(key => {
      appendValueToFormData(key, data[key]);
    });
  } catch (e) {
    log.error(e.message);
  }

  return formData;
}

type RequestOptions = {
  format: 'json' | 'formData';
  query: Object;

  body: any;
  credentials: 'include' | 'omit' | 'same-origin';
  cache: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache'
    | 'only-if-cached';
  headers: Object;
  integrity: any;
  method: 'DELETE' | 'GET' | 'POST' | 'PUT';
  mode: 'cors' | 'navigate' | 'no-cors' | 'same-origin';
  redirect: 'follow' | 'error' | 'manual';
  referrer: 'client' | 'no-referrer' | string;
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin'
    | 'origin-when-cross-origin' | 'unsafe-url';
};