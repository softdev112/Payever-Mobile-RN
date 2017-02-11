import { observable, action, extendObservable } from 'mobx';
import { now, isDate } from 'lodash';
import { AsyncStorage } from 'react-native';
import { apiHelper } from 'utils';
import type Store from './index';
import type { AuthData } from '../common/api/AuthApi';


const STORE_NAME = 'store.auth';

export default class AuthStore {
  @observable isLoggedIn: boolean  = false;
  @observable accessToken: string  = null;
  @observable refreshToken: string = null;
  @observable expiresIn: Date      = null;

  @observable error: string        = '';
  @observable isLoading: string    = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  signIn(username, password): Promise<SignInResult> {
    const { api } = this.store;

    return apiHelper(api.auth.login(username, password), this)
      .success((data: AuthData) => {
        this.accessToken  = data.access_token;
        this.refreshToken = data.refresh_token;
        this.expiresIn    = data.expires_in;
        this.isLoggedIn   = true;
        //noinspection JSIgnoredPromiseFromCall
        this.serialize();
      })
      .promise();
  }

  @action
  setError(error: string) {
    this.error = error;
  }

  @action
  logout(): Promise {
    const { api } = this.store;

    this.accessToken = null;
    this.refreshToken = null;
    this.expiresIn = null;
    this.isLoggedIn = null;

    return api.auth.logout()
      .then(() => AsyncStorage.clear());
  }

  @action
  updateTokens(data) {
    const expires = data.expiresIn;
    if (expires && !isDate(expires) && isFinite(expires)) {
      data.expiresIn = new Date(now() + ((expires - 10) * 1000));
    }

    extendObservable(this, data);
    //noinspection JSIgnoredPromiseFromCall
    this.serialize();
  }

  serialize(): Promise {
    return AsyncStorage.setItem(STORE_NAME, JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
    }))
      .catch(e => console.error(e));
  }

  async getAccessToken() {
    const { api } = this.store;

    if (this.accessToken && this.expiresIn > new Date()) {
      return this.accessToken;
    }
    if (!this.refreshToken) {
      throw new Error('AuthStore: Couldn\'t refresh, refreshToken is null');
    }
    return await api.auth.refreshToken(this.refreshToken);
  }

  async deserialize(): Promise<AuthStore> {
    let json;
    try {
      json = await AsyncStorage.getItem(STORE_NAME);
      if (!json) return this;
    } catch (e) {
      console.error(e);
      return this;
    }

    const data = JSON.parse(json);
    this.isLoggedIn = data.isLoggedIn;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.expiresIn = new Date(data.expiresIn);

    return this;
  }
}

type SignInResult = {
  success: boolean;
  error: string;
};