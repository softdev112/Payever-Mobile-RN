/* eslint-disable max-len, global-require */
import { cacheHelper, networkHelper } from 'utils';

import Store from '../../../store';
import config from '../../../config';
import searchData from './data';

// const mobx = require('mobx');

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

describe('Contacts/Store', () => {
  let store;
  let search;
  let api;
  let getSpy;
//  let postSpy;

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

    store.api.fetch = jest.fn(url => url);
    getSpy = jest.spyOn(store.api, 'get');
    // postSpy = jest.spyOn(store.api, 'post');
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
      const apySpy = jest.spyOn(search, 'search');

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

    fit('search should makes right store state after receiving data', async () => {
      const apySpy = jest.spyOn(search, 'search');
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
      expect(search.items).toHaveLength(search.items.length);
    });
  });
});