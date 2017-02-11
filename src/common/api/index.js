import { log } from 'utils';

import type AuthStore from '../../store/AuthStore';
import AuthApi from './AuthApi';
import BusinessApi from './BusinessApi';
import DashboardApi from './DashboardApi';
import UserApi from './UserApi';
import ProfilesApi from './ProfilesApi';
import MenuApi from './MenuApi';
import MessengerApi from './MessengerApi';
import DeviceApi from './DeviceApi';
import { showScreen } from '../Navigation';
import type { Config } from '../../config';

export default class PayeverApi {
  auth: AuthApi;
  business: BusinessApi;
  dashboard: DashboardApi;
  menu: MenuApi;
  messenger: MessengerApi;
  user: UserApi;
  profiles: ProfilesApi;

  baseUrl: string;
  clientId: string;
  clientSecret: string;
  logApiCall: boolean;

  authStore: AuthStore;

  constructor(config: Config, authStore: AuthStore) {
    Object.assign(this, config.api);
    this.authStore = authStore;
    this.logApiCall = config.debug.logApiCall;

    this.registerSubApi();
  }

  registerSubApi() {
    this.auth      = new AuthApi(this);
    this.dashboard = new DashboardApi(this);
    this.business  = new BusinessApi(this);
    this.menu      = new MenuApi(this);
    this.messenger = new MessengerApi(this);
    this.user      = new UserApi(this);
    this.profiles  = new ProfilesApi(this);
    this.device    = new DeviceApi(this);
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
    requestData: Object = null,
    requestOptions: RequestOptions = {}
  ): Promise<ApiResp> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const contentType = requestOptions.format === 'formData'
      ? 'multipart/form-data' : 'application/json';
    headers.append('Content-Type', contentType);

    const token = await this.authStore.getAccessToken();
    headers.append('Authorization', 'Bearer ' + token);

    if (requestOptions.addTokenToHeaders) {
      headers.append('access_token', token);
    }

    const options = {
      headers,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      cache: 'default',
    };

    if (requestOptions.format === 'formData') {
      options.body = objectToFormData(requestData);
    } else {
      options.body = JSON.stringify(requestData);
    }

    return this.fetch(url, options);
  }

  //noinspection ReservedWordAsName
  async delete(
    url: string,
    requestData: Object = null,
    requestOptions: RequestOptions = {}
  ): Promise<ApiResp> {
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    const contentType = requestOptions.format === 'formData'
      ? 'multipart/form-data' : 'application/json';
    headers.append('Content-Type', contentType);

    const token = await this.authStore.getAccessToken();
    headers.append('Authorization', 'Bearer ' + token);

    if (requestOptions.addTokenToHeaders) {
      headers.append('access_token', token);
    }

    const options = {
      headers,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      cache: 'default',
    };

    if (requestOptions.format === 'formData') {
      options.body = objectToFormData(requestData);
    } else {
      options.body = JSON.stringify(requestData);
    }

    return this.fetch(url, options);
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
        response.errorDescription = response.data.error_description;
      }
    } catch (e) {
      response.data = {};
      response.error = 'json_error';
      response.errorDescription = 'Wrong server response';
    }

    if (!options.preventTokenRefresh &&
      response.error === 'invalid_grant') {
      const token = await this.auth.refreshToken(this.authStore.refreshToken);
      if (token) {
        return await this.fetch(url, { ...options, preventTokenRefresh: true });
      }
      showScreen('auth.Login');
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
  addTokenToHeaders: boolean;
};