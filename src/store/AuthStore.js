import type Store from './index';

import { observable, action, runInAction } from 'mobx';
import { AsyncStorage } from 'react-native';

const STORE_NAME = 'store.auth';

export default class AuthStore {
  @observable isLoggedIn   = false;
  @observable accessToken  = null;
  @observable refreshToken = null;
  @observable expiresIn    = null;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  async signIn(username, password): Promise<SignInResult> {
    const { api } = this.store;

    let data = {};
    try {
      const resp = await api.auth.login(username, password);
      data = resp.data;
      if (!resp.ok) {
        return { success: false, error: data.error_description };
      }
    } catch (e) {
      console.warn(e);
      return { success: false, error: 'Internal error. Please try later.'}
    }



    runInAction('Update auth state', () => {
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresIn = data.expires_in;
      this.isLoggedIn = true;
    });

    //noinspection JSIgnoredPromiseFromCall
    this.serialize();

    return { success: true };
  }

  serialize(): Promise {
    return AsyncStorage.setItem(STORE_NAME, JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn
    }))
      .catch(e => console.error(e));
  }

  async deserialize(): Promise<AuthStore> {
    return this;
    /*let json;
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
    this.expiresIn = data.expiresIn;

    this.store.api.setConfig({
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn
    });

    return this;
     */
  }
}

type SignInResult = {
  success: boolean,
  error: string
}