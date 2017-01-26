import { merge } from 'lodash';
import { log } from 'utils';

import type AuthStore from '../../store/AuthStore';
import AuthApi from './AuthApi';
import BusinessApi from './BusinessApi';
import DashboardApi from './DashboardApi';
import UserApi from './UserApi';
import ProfilesApi from './ProfilesApi';
import MenuApi from './MenuApi';
import MessengerApi from './MessengerApi';
import { showScreen } from '../Navigation';

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

  authStore: AuthStore;

  constructor(config: PayeverApiConfig) {
    this.setConfig(config);
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
  }

  setConfig(config: PayeverApiConfig) {
    if (typeof config.baseUrl === 'string' && config.baseUrl.endsWith('/')) {
      config.baseUrl = config.baseUrl.slice(0, -1);
    }

    merge(this, config);
  }

  async get(url: string, query: Object = null): Promise<ApiResp> {
    query = {
      ...query,
      access_token: await this.getAccessToken(),
    };
    return this.fetch(url, { query });
  }

  async post(url: string, requestData: RequestData = null): Promise<ApiResp> {
    const options = {
      method: 'POST',
    };

    if (requestData && typeof requestData === 'object') {
      if (requestData.format && requestData.format !== 'json') {
        options.body = objectToPhpFormData(requestData.data);
      } else {
        options.body = JSON.stringify(requestData.data);
      }
    }

    return this.fetch(url, options);
  }

  //noinspection ReservedWordAsName
  async delete(url: string, requestData: RequestData = null): Promise<ApiResp> {
    const options = {
      method: 'DELETE',
    };

    if (requestData && typeof requestData === 'object') {
      if (requestData.format && requestData.format !== 'json') {
        options.body = objectToPhpFormData(requestData.data);
      } else {
        options.body = JSON.stringify(requestData.data);
      }
    }

    return this.fetch(url, options);
  }

  //noinspection InfiniteRecursionJS
  async fetch(url: string, options: Object = {}): Promise<ApiResp> {
    options.method = options.method || 'GET';
    url = this.normalizeUrl(url, options.query);

    if (__DEV__) {
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

    if (__DEV__) {
      log.debug('Response data ', response.data);
    }

    return response;
  }

  async getAccessToken() {
    if (this.authStore.accessToken && this.authStore.expiresIn > new Date()) {
      return this.authStore.accessToken;
    }
    if (!this.authStore.refreshToken) {
      throw new Error('PayeverApi: refreshToken is null');
    }
    return await this.auth.refreshToken(this.authStore.refreshToken);
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

function objectToPhpFormData(data: Object) {
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

type PayeverApiConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  expiresIn: Date;
  refreshToken: string;
};

type RequestData = {
  format: string;
  data: Object;
};