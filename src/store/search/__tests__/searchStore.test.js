/* eslint-disable max-len, global-require */
import { cacheHelper, networkHelper } from 'utils';

import Store from '../../../store';
import config from '../../../config';
import searchData from './data';

const mobx = require('mobx');

const PROFILE = {
  business: {
    slug: '11111',
  },
};

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
  .mock('../../../store/auth');

describe('Store/Searh', () => {
  let store;
  let search;
  let api;
  let getSpy;
  let postSpy;
  let deleteSpy;

  beforeAll(() => {
    networkHelper.isConnected.mockImplementation(() => true);
    cacheHelper.loadFromCache.mockImplementation(() => ({ data: 'data' }));
    cacheHelper.isCacheUpToDate.mockImplementation(() => false);
  });

  beforeEach(() => {
    store = new Store(config);
    search = store.search;
    api = store.api;
    store.profiles.currentProfile = PROFILE;

    api.fetch = jest.fn(url => url);
    getSpy = jest.spyOn(store.api, 'get');
    postSpy = jest.spyOn(store.api, 'post');
    deleteSpy = jest.spyOn(store.api, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('SearchStore should be created in the main store', () => {
    expect(store.search).toBeTruthy();
  });

  describe('Search/search(query)', () => {
    it('search should call api with right url', async () => {
      const apySpy = jest.spyOn(api.profiles, 'search');

      await search.search('xc');

      expect(networkHelper.isConnected).toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/profiles/search',
        { query: { access_token: undefined, c: 20, k: 'xc' } }
      );
    });

    it('search should makes right store state after receiving data', async () => {
      const apySpy = jest.spyOn(api.profiles, 'search');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(searchData)
      );

      expect(search.items).toHaveLength(0);
      await search.search('xc');

      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(getSpy).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/profiles/search',
        { query: { access_token: undefined, c: 20, k: 'xc' } }
      );
      expect(search.items).toHaveLength(searchData.length);
      expect(mobx.toJS(search.items)).toEqual(
        searchData.map(i => {
          i.is_followUpdating = false;
          return i;
        })
      );
    });
  });

  describe('Search/follow)', () => {
    it('follow should call api with right url', async () => {
      const apySpy = jest.spyOn(api.profiles, 'follow');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(searchData)
      );

      expect(search.items).toHaveLength(0);
      await search.search('xc');
      expect(search.items).toHaveLength(searchData.length);

      jest.clearAllMocks();
      await search.follow(168510);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenLastCalledWith(
        '/api/rest/v1/profiles/168510/follow'
      );
    });

    it('follow should NOT call api if it gets wrong business id', async () => {
      const apySpy = jest.spyOn(api.profiles, 'follow');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(searchData)
      );

      expect(search.items).toHaveLength(0);
      await search.search('xc');
      expect(search.items).toHaveLength(searchData.length);

      jest.clearAllMocks();
      await search.follow(168510000);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apySpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
    });
  });

  describe('Search/unfollow)', () => {
    it('unfollow should call api with right url', async () => {
      const apySpy = jest.spyOn(api.profiles, 'unfollow');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(searchData)
      );

      expect(search.items).toHaveLength(0);
      await search.search('xc');
      expect(search.items).toHaveLength(searchData.length);

      jest.clearAllMocks();
      await search.unfollow(168510);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(apySpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenLastCalledWith(
        '/api/rest/v1/profiles/168510/unfollow'
      );
      expect(postSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenLastCalledWith(
        '/api/rest/v1/profiles/168510/unfollow',
        null,
        { method: 'DELETE' }
      );
    });

    it('unfollow should NOT call api if it gets wrong business id', async () => {
      const apySpy = jest.spyOn(api.profiles, 'unfollow');
      networkHelper.loadFromApi.mockImplementationOnce(
        () => Promise.resolve(searchData)
      );

      expect(search.items).toHaveLength(0);
      await search.search('xc');
      expect(search.items).toHaveLength(searchData.length);

      jest.clearAllMocks();
      await search.unfollow(168510000);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apySpy).not.toHaveBeenCalled();
      expect(postSpy).not.toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    });
  });
});