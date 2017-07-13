/* eslint-disable max-len, global-require */
import { cacheHelper, networkHelper } from 'utils';
import { AsyncStorage } from 'react-native';
import { showScreen } from '../../../common/Navigation';

import Store from '../../../store';
import config from '../../../config';
import authData from './data';

// const mobx = require('mobx');

jest.mock('react-native-navigation', () => ({
  Navigation: {
    showModal: jest.fn(() => {}),
    dismissModal: jest.fn(() => {}),
  },
})).mock('react-native-logging')
  .mock(
    '../../../store/communication/ui',
    () => function CommunicationUI() { return {}; }
  ).mock('../../../common/utils/networkHelper')
  .mock('../../../common/utils/cacheHelper')
  .mock('../../../common/Navigation');

describe('Store/Auth', () => {
  let store;
  let auth;
  let api;
  let getSpy;
  let postSpy;

  beforeAll(() => {
    AsyncStorage.setItem = jest.fn(() => Promise.resolve(1));
    AsyncStorage.clear = jest.fn(() => Promise.resolve(1));

    networkHelper.isConnected.mockImplementation(() => true);
    cacheHelper.loadFromCache.mockImplementation(() => ({ data: 'data' }));
    cacheHelper.isCacheUpToDate.mockImplementation(() => false);
  });

  beforeEach(() => {
    store = new Store(config);
    auth = store.auth;
    api = store.api;

    api.fetch = jest.fn(url => url);
    getSpy = jest.spyOn(store.api, 'get');
    postSpy = jest.spyOn(store.api, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('Auth store should be created in the main store', () => {
    expect(store.auth).toBeTruthy();
  });

  describe('Auth/signIn)', () => {
    it('signIn should call api with right url', async () => {
      const apiSpy = jest.spyOn(api.auth, 'login');

      await auth.signIn('user', 'password');

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0]).toBe('/oauth/v2/token');
    });

    it('signIn should NOT call api if password or user = null | undefined', async () => {
      const apiSpy = jest.spyOn(api.auth, 'login');

      await auth.signIn(null, null);
      await auth.signIn(null, 'password');
      await auth.signIn('user', null);
      await auth.signIn('user', undefined);
      await auth.signIn(undefined, 'password');
      await auth.signIn(undefined, undefined);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(getSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });

    it('signIn should set isLoading to true', async (done) => {
      const apiSpy = jest.spyOn(api.auth, 'login');
      networkHelper.loadFromApi.mockImplementationOnce(() => {
        try {
          expect(auth.isLoading).toBe(true);
          done();
          return Promise.resolve(authData);
        } catch (err) {
          done.fail(err);
          return null;
        }
      });

      expect(auth.isLoading).toBe(false);
      await auth.signIn('user', 'password');

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(auth.isLoading).toBe(false);
    });

    it('signIn should set error if there is error occurred while getting data', async () => {
      const apiSpy = jest.spyOn(api.auth, 'login');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server error'); }
      );

      expect(auth.error).toBe('');
      await auth.signIn('user', 'password');

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(auth.error).toBe(networkHelper.errorConnection);
    });
  });

  describe('Auth/registerNewUser)', () => {
    it('registerNewUser should call api with right url', async () => {
      const apiSpy = jest.spyOn(api.auth, 'registerNewUser');

      await auth.registerNewUser(authData.fakeUser);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0]).toBe('/api/rest/v1/user/register');
    });

    it('registerNewUser should NOT call api if user = null | undefined', async () => {
      const apiSpy = jest.spyOn(api.auth, 'registerNewUser');

      await auth.registerNewUser(null);
      await auth.registerNewUser(undefined);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });

    it('registerNewUser should set isLoading to true', async (done) => {
      const apiSpy = jest.spyOn(api.auth, 'registerNewUser');
      networkHelper.loadFromApi.mockImplementationOnce(() => {
        try {
          expect(auth.isLoading).toBe(true);
          done();
          return Promise.resolve(authData.fakeUser);
        } catch (err) {
          done.fail(err);
          return null;
        }
      });

      expect(auth.isLoading).toBe(false);
      await auth.registerNewUser(authData.fakeUser);

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(auth.isLoading).toBe(false);
    });

    it('registerNewUser should set error if there is error occurred while getting data', async () => {
      const apiSpy = jest.spyOn(api.auth, 'registerNewUser');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => { throw new Error('Server error'); }
      );

      expect(auth.error).toBe('');
      await auth.registerNewUser(authData.fakeUser);

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(auth.error).toBe(networkHelper.errorConnection);
    });
  });

  describe('Auth/resetPassword', () => {
    it('resetPassword should call api with right url', async () => {
      const apiSpy = jest.spyOn(api.auth, 'resetPassword');

      await auth.resetPassword(authData.fakeUser.email);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0])
        .toBe('/api/rest/v1/user/resetting/send-email');
    });

    it('resetPassword should NOT call api if email = null | undefined | empty string', async () => {
      const apiSpy = jest.spyOn(api.auth, 'resetPassword');

      await auth.resetPassword(null);
      await auth.resetPassword(undefined);
      await auth.resetPassword('');

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Auth/signInWithSocial(socialNetwork: string, socialUserInfo)', () => {
    it('signInWithSocial should call api with right url', async () => {
      const apiSpy = jest.spyOn(api.auth, 'loginWithTemporarySocialUser');
      auth.connectToSocial = jest.fn(
        () => Promise.resolve(authData.fakeSocialInfo)
      );

      await auth.signInWithSocial('twitter', authData.fakeUser);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(auth.connectToSocial).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0])
        .toBe('/oauth/v2/token');
    });

    it('signInWithSocial should NOT call api if socialNetwork or socialUserInfo = null | undefined | empty string', async () => {
      const apiSpy = jest.spyOn(api.auth, 'loginWithTemporarySocialUser');
      auth.connectToSocial = jest.fn(
        () => Promise.resolve(authData.fakeSocialInfo)
      );

      await auth.signInWithSocial('', authData.fakeUser);
      await auth.signInWithSocial(null, authData.fakeUser);
      await auth.signInWithSocial(undefined, authData.fakeUser);
      await auth.signInWithSocial('twitter', null);
      await auth.signInWithSocial('twitter', undefined);
      await auth.signInWithSocial(undefined, undefined);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(auth.connectToSocial).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });

    it('signInWithSocial should NOT call api if connectToSocial endpoint returns wrong data', async () => {
      const apiSpy = jest.spyOn(api.auth, 'loginWithTemporarySocialUser');
      auth.connectToSocial = jest.fn(
        () => Promise.reject(null)
      );

      await auth.signInWithSocial('twitter', authData.fakeUser);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(auth.connectToSocial).toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Auth/connectToSocial(socialName, credentials: SocialCredentials)', () => {
    it('connectToSocial should call api with right url', async () => {
      const apiSpy = jest.spyOn(api.auth, 'connectToSocial');

      const socialNetwork = 'twitter';
      await auth.connectToSocial(socialNetwork, authData.fakeUser);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0])
        .toBe(`/api/rest/v1/connect/${socialNetwork}`);
    });

    it('connectToSocial should NOT call api if socialNetwork or credentials = null | undefined', async () => {
      const apiSpy = jest.spyOn(api.auth, 'connectToSocial');

      const socialNetwork = 'twitter';
      await auth.connectToSocial('', authData.fakeUser);
      await auth.connectToSocial(undefined, authData.fakeUser);
      await auth.connectToSocial(null, authData.fakeUser);
      await auth.connectToSocial(socialNetwork, null);
      await auth.connectToSocial(socialNetwork, undefined);
      await auth.connectToSocial('', undefined);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Auth/setError(error: string)', () => {
    it('setError should set store.auth.error to error', async () => {
      const errorText = 'Some error';

      expect(auth.error).toBe('');
      auth.setError(errorText);
      expect(auth.error).toBe(errorText);
    });

    it('setError should live error = empty string if error param = null, undefined ', async () => {
      expect(auth.error).toBe('');
      auth.setError(null);
      auth.setError(undefined);
      expect(auth.error).toBe('');
    });
  });

  describe('Auth/logout()', () => {
    it('logout should clear current credentials', async () => {
      const apiSpy = jest.spyOn(api.auth, 'logout');
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = 'not expired';
      auth.isLoggedIn = true;

      expect(auth.accessToken).toBe('token');
      expect(auth.refreshToken).toBe('refresh_token');
      expect(auth.expiresIn).toBe('not expired');
      expect(auth.isLoggedIn).toBe(true);

      await auth.logout();

      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith('/logout');
      expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
      expect(auth.accessToken).toBeNull();
      expect(auth.refreshToken).toBeNull();
      expect(auth.expiresIn).toBeNull();
      expect(auth.isLoggedIn).toBeNull();
    });
  });

  describe('Auth/getAccessToken(forceUpdate: boolean = false)', () => {
    it('getAccessToken should return valid token and set store state', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve({ data: 'data' })
      );
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(2000);
      auth.isLoggedIn = true;

      await auth.getAccessToken();

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(auth.updateTokens).toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0]).toBe('/oauth/v2/token');
      expect(api.fetch.mock.calls[0][1].query).toBeTruthy();
      expect(api.fetch.mock.calls[0][1].query.refresh_token).toBeTruthy();
      expect(api.fetch.mock.calls[0][1].query.refresh_token)
        .toBe(auth.refreshToken);
    });

    it('getAccessToken should throw exception if refreshToken = null', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = null;
      auth.expiresIn = new Date(2000);
      auth.isLoggedIn = true;

      try {
        await auth.getAccessToken();
      } catch (err) {
        expect(err).toEqual(
          new Error('AuthStore: Couldn\'t refresh, refreshToken is null')
        );
      }
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
    });

    it('getAccessToken should call showScreen to show Launch screen if it can not refresh token', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(2000);
      auth.isLoggedIn = true;

      await auth.getAccessToken();

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0]).toBe('/oauth/v2/token');
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('core.LaunchScreen');
    });

    it('getAccessToken should NOT call api if token NOT expired and forceUpdate = false', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve({ data: 'data' })
      );
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(Date.now() + 20000);
      auth.isLoggedIn = true;

      const result = await auth.getAccessToken();

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(result).toBe('token');
    });

    it('getAccessToken should call api if token NOT expired and forceUpdate = true', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve({ data: 'data' })
      );
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(Date.now() + 20000);
      auth.isLoggedIn = true;

      await auth.getAccessToken(true);

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(auth.updateTokens).toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch.mock.calls).toHaveLength(1);
      expect(api.fetch.mock.calls[0][0]).toBe('/oauth/v2/token');
      expect(api.fetch.mock.calls[0][1].query).toBeTruthy();
      expect(api.fetch.mock.calls[0][1].query.refresh_token).toBeTruthy();
      expect(api.fetch.mock.calls[0][1].query.refresh_token)
        .toBe(auth.refreshToken);
    });

    it('getAccessToken should NOT call api if token expired but there is no connection', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.isConnected.mockImplementationOnce(() => false);
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(20000);
      auth.isLoggedIn = true;

      const result = await auth.getAccessToken();

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(result).toBe('token');
    });

    it('getAccessToken should NOT call api if token = empty string but there is no connection', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.isConnected.mockImplementationOnce(() => false);
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = '';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(Date.now() + 20000);
      auth.isLoggedIn = true;

      const result = await auth.getAccessToken();

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(result).toBe('');
    });

    it('getAccessToken should NOT call api even if forceUpdate = true but there is no connection', async () => {
      const apiSpy = jest.spyOn(api.auth, 'refreshToken');
      networkHelper.isConnected.mockImplementationOnce(() => false);
      auth.updateTokens = jest.fn(() => {});
      auth.accessToken = 'token';
      auth.refreshToken = 'refresh_token';
      auth.expiresIn = new Date(Date.now() + 20000);
      auth.isLoggedIn = true;

      const result = await auth.getAccessToken(true);

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(auth.updateTokens).not.toHaveBeenCalled();
      expect(showScreen).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(api.fetch).not.toHaveBeenCalled();
      expect(result).toBe('token');
    });
  });
});