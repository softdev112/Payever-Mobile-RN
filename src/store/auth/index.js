import { action, observable, runInAction } from 'mobx';
import { now, isDate } from 'lodash';
import { AsyncStorage, NetInfo } from 'react-native';
import { apiHelper, log } from 'utils';
import type Store from './../index';
import type { AuthData } from '../../common/api/AuthApi';
import { showScreen } from '../../common/Navigation';

const STORE_NAME = 'store.auth';
const DEFAULT_EXPIRES_TOKEN = 3600;

export default class AuthStore {
  @observable isLoggedIn: boolean  = false;
  @observable accessToken: string  = null;
  @observable refreshToken: string = null;
  @observable expiresIn: Date      = null;

  @observable deserialized: boolean = false;

  @observable error: string        = '';
  @observable isLoading: string    = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  signIn(username, password): Promise<SignInResult> {
    const { auth } = this.store.api;

    return apiHelper(auth.login.bind(auth, username, password), this)
      .success((data: AuthData) => {
        this.updateTokens(data);
      })
      .promise();
  }

  @action
  registerNewUser(user) {
    const { auth } = this.store.api;

    return apiHelper(auth.registerNewUser.bind(auth, user), this)
      .success()
      .error(log.error)
      .promise();
  }

  @action
  resetPassword(email) {
    const { auth } = this.store.api;

    return apiHelper(auth.resetPassword.bind(auth, email), this)
      .success(() => true)
      .error((err) => {
        log.error(err);
        return false;
      })
      .promise();
  }

  @action
  resendConfirmationEmail(email) {
    const { auth } = this.store.api;

    return apiHelper(auth.resendConfirmationEmail.bind(auth, email), this)
      .success(() => true)
      .error((err) => {
        log.error(err);
        return false;
      })
      .promise();
  }

  @action
  async signInWithSocial(socialNetwork: string, socialUserInfo) {
    const { auth } = this.store.api;

    const userInfo = await this.connectToSocial(socialNetwork, socialUserInfo);

    return apiHelper(auth.loginWithTemporarySocialUser.bind(
      auth,
      userInfo.client_id,
      userInfo.secret_key
    ),
      this
    ).success((data: AuthData) => {
      this.updateTokens(data);
    }).error(log.error)
      .promise();
  }

  @action
  connectToSocial(socialName, credentials: SocialCredentials) {
    const { auth } = this.store.api;

    return apiHelper(
      auth.connectToSocial.bind(auth, socialName, credentials),
      this
    ).success((data: AuthData) => data)
      .error(log.error)
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
  async getAccessToken() {
    const { auth } = this.store.api;

    log.debug('Expires value', this.expiresIn);

    // Test if internet connection available if not do not update token
    // but grunt access
    if ((this.accessToken && this.expiresIn > new Date())
      || !(await NetInfo.isConnected)) {
      return this.accessToken;
    }

    if (!this.refreshToken) {
      throw new Error('AuthStore: Couldn\'t refresh, refreshToken is null');
    }

    return apiHelper(
      auth.refreshToken.bind(auth, this.refreshToken),
      this,
      false
    ).success((data: AuthData) => {
      this.updateTokens(data);
      return data.access_token;
    }).error((e) => {
      log.warn('Could not refresh token. Try to restart application', e);
      showScreen('core.LaunchScreen');
    }).promise();
  }

  updateTokens(data) {
    const expires = data.expires_in;
    if (expires && !isDate(expires) && isFinite(expires)) {
      data.expires_in = new Date(now() + ((expires - 10) * 1000));
    } else {
      data.expires_in =
        new Date(now() + ((DEFAULT_EXPIRES_TOKEN - 10) * 1000));
    }

    this.accessToken  = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expiresIn    = data.expires_in;
    this.isLoggedIn   = true;

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
      .catch(log.error);
  }

  @action
  async deserialize(): Promise<AuthStore> {
    let data;
    try {
      const json = await AsyncStorage.getItem(STORE_NAME);
      data = JSON.parse(json || '{}');
    } catch (e) {
      log.error(e);
      data = {};
    }

    runInAction('Deserialize auth', () => {
      this.isLoggedIn = data.isLoggedIn || false;
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.expiresIn = new Date(data.expiresIn);
      this.deserialized = true;
    });

    return this;
  }

  async checkAuth() {
    if (!this.deserialized) {
      await this.deserialize();
    }

    if (!this.isLoggedIn) {
      return false;
    }

    try {
      const token = await this.getAccessToken();
      return !!token;
    } catch (e) {
      log.warn(e);
      return false;
    }
  }
}

type SignInResult = {
  success: boolean;
  error: string;
};

type SocialCredentials = {
  access_token: string;
  expires_in: string;
  oauth_token: string;
  oauth_token_secret: string;
};