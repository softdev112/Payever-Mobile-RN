import type AuthApi from '../modules/auth/api/AuthApi';

import { each } from 'lodash';

type PayeverApiConfig = {
  baseUrl: string,
  clientId: string,
  clientSecret: string
};

export default class PayeverApi {
  auth: AuthApi;

  baseUrl: string;
  clientId: string;
  clientSecret: string;

  constructor(config: PayeverApiConfig, childClasses: {[id: string]: Class}) {
    this.baseUrl      = config.baseUrl;
    this.clientId     = config.clientId;
    this.clientSecret = config.clientSecret;

    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }

    each(childClasses, (Class, name) => {
      this[name] = new Class(this);
    });
  }

  get(url: string, params: Object = null): Promise<Response> {
    return fetch(this.normalizeUrl(url, params), {
      method: 'get'
    })
      .then(async (response: Response) => {
        let data = {};
        try {
          data = await response.json();
        } catch(e) {
          console.error(e);
        }

        response.data = data;
        return response;
      });
  }

  normalizeUrl(url: string, getParams: Object = null) {
    let fullUrl = this.baseUrl + url;
    if (getParams) {
      fullUrl += '?' + objectToQueryString(getParams)
    }
    return fullUrl;
  }
}

function objectToQueryString(data: Object): string {
  return Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&');
}


