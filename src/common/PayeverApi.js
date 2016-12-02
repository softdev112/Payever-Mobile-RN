import type AuthApi from '../modules/auth/api/AuthApi';
import type UserApi from '../modules/user/api/UserApi';

import { each, merge, isDate, now } from 'lodash';

type PayeverApiConfig = {
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  accessToken: string,
  expiresIn: Date,
  refreshToken: string;
};

declare class PayeverResponse extends Response {
  data: {
    error?: string,
    error_description?: string
  };
  json(): Object;
}

export default class PayeverApi {
  auth: AuthApi;
  user: UserApi;

  baseUrl: string;
  clientId: string;
  clientSecret: string;

  accessToken: string;
  expiresIn: Date;
  refreshToken: string;

  constructor(config: PayeverApiConfig, childClasses: {[id: string]: Class}) {
    this.setConfig(config);

    each(childClasses, (Class, name) => {
      this[name] = new Class(this);
    });
  }

  setConfig(config: PayeverApiConfig) {
    if (typeof config.baseUrl === 'string' && config.baseUrl.endsWith('/')) {
      config.baseUrl = config.baseUrl.slice(0, -1);
    }

    const expires = config.expiresIn;
    if (expires && !isDate(expires) && isFinite(expires)) {
      config.expiresIn = new Date(now() + (expires - 10) * 1000);
    }

    merge(this, config);
  }

  async get(url: string, query: Object = null): Promise<Response> {
    query = {
      ...query,
      access_token: await this.getAccessToken()
    };
    return this.fetch(url, { query });
  }

  async fetch(url: string, options: Object = {}): Promise<PayeverResponse> {
    options.method = options.method || 'GET';
    const response: PayeverResponse = await fetch(
      this.normalizeUrl(url, options.query),
      options
    );
    const text = await response.text();
    try {
      response.data = JSON.parse(text);
    } catch(e) {
      console.log('PayeverApi: Error parsing JSON', text);
      response.data = {
        error: 'json_error',
        error_description: 'Wrong server response'
      }
    }

    return response;
  }

  async getAccessToken() {
    if (this.accessToken && this.expiresIn > new Date()) {
      return this.accessToken;
    }
    if (!this.refreshToken) {
      throw new Error('PayeverApi: refreshToken is null')
    }
    return await this.auth.refreshToken(this.refreshToken);
  }

  normalizeUrl(url: string, query: Object = null) {
    let fullUrl = this.baseUrl + url;
    if (query && Object.keys(query).length) {
      fullUrl += '?' + objectToQueryString(query)
    }
    return fullUrl;
  }
}

function objectToQueryString(data: Object): string {
  return Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&');
}


