/* eslint-disable max-len, global-require */
import { networkHelper, cacheHelper } from 'utils';

import Store from '../../../store';
import config from '../../../config';

const mobx = require('mobx');

jest.mock(
  '../../../store/communication/ui',
  () => function CommunicationUI() { return {}; }
).mock('../../../common/utils/networkHelper')
  .mock('../../../common/utils/cacheHelper')
  .mock('../../../store/auth')
  .mock('react-native-navigation', () => ({
    Navigation: {
      showModal: jest.fn(() => {}),
      dismissModal: jest.fn(() => {}),
    },
  }))
  .mock('react-native-logging');

networkHelper.isConnected.mockImplementation(() => true)
  .mockImplementationOnce(() => true)
  .mockImplementationOnce(() => true)
  .mockImplementationOnce(() => false);

const TEST_PROFILE = {
  applications: [
    { name: 'App 1' },
    { name: 'App 2' },
    { name: 'App 3' },
  ],

  activities: [
    { name: 'Activity 1' },
    { name: 'Activity 2' },
    { name: 'Activity 3' },
  ],

  todos: [
    { name: 'Todo 1' },
    { name: 'Todo 2' },
    { name: 'Todo 3' },
  ],

  business: {
    slug: '11111',
  },
};

describe('Profiles/Store', () => {
  let store;

  beforeAll(() => {

  });

  beforeEach(() => {
    store = new Store(config);
    store.api.fetch = jest.fn((url, options) => options.body);
    store.profiles.businessById = jest.fn(() => TEST_PROFILE);
    cacheHelper.loadFromCache.mockImplementation(() => {});
    cacheHelper.isCacheUpToDate.mockImplementation(() => false);

    jest.clearAllMocks();
  });

  afterEach(() => {
    store = null;
  });

  it('ProfilesStore should be created in the main store', () => {
    expect(store.profiles).toBeTruthy();
  });

  describe('Profiles/getAllProfiles(includePrivate = true)', () => {
    it('getAllProfiles(includePrivate = true) should return all profiles in array', () => {
      store.profiles.privateProfile = { profile: 1 };
      store.profiles.ownBusinesses = [{ profile: 2 }, { profile: 3 }];
      store.profiles.staffBusinesses = [{ profile: 4 }, { profile: 5 }];

      const profiles = store.profiles.getAllProfiles();
      expect(profiles.length).toBe(5);
      expect(profiles).toEqual([
        { profile: 1 },
        { profile: 2 },
        { profile: 3 },
        { profile: 4 },
        { profile: 5 },
      ]);
    });
  });

  describe('Profiles Store/load(options = {})', () => {
    it('Test if cache not expired load(options = {}) should not call api', async () => {
      const apiSpy = jest.spyOn(store.api.profiles, 'getAccessibleList');
      cacheHelper.isCacheUpToDate.mockImplementationOnce(() => true);
      await store.profiles.load();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });

    it('Test if cache expired available load(options = {}) should call api', async () => {
      const apiSpy = jest.spyOn(store.api.profiles, 'getAccessibleList');
      await store.profiles.load();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/profiles/accessible-list',
        { query: { access_token: undefined } }
      );
    });

    it('Test if cache not available and no connection load() should not call api', async () => {
      cacheHelper.loadFromCache.mockImplementation(() => null);
      const apiSpy = jest.spyOn(store.api.profiles, 'getAccessibleList');
      await store.profiles.load();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });

    it('Test if noCache option is true load() should call api', async () => {
      cacheHelper.loadFromCache.mockImplementation(() => null);
      const apiSpy = jest.spyOn(store.api.profiles, 'getAccessibleList');
      await store.profiles.load({ noCache: true });

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(store.api.fetch).toHaveBeenCalledTimes(1);
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/profiles/accessible-list',
        { query: { access_token: undefined } }
      );
    });
  });

  describe('Profiles Store/loadApplications(profileId)', () => {
    it('Test if applications are already loaded loadApplication(profileId) should not call api', async () => {
      const apiSpy = jest.spyOn(store.api.menu, 'getList');
      const apps = await store.profiles.loadApplications(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);
      expect(apps).toEqual(TEST_PROFILE.applications);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });

    it('Test if applications are not loaded loadApplication(profileId) should call api', async () => {
      store.profiles.businessById = jest.fn(() => ({
        ...TEST_PROFILE,
        applications: [],
      }));
      const apiSpy = jest.spyOn(store.api.menu, 'getList');
      await store.profiles.loadApplications(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/menu/list/11111',
        { query: { access_token: undefined, current: 'home' } }
      );
    });
  });

  describe('Profiles Store/loadActivities(profileId)', () => {
    it('Test if activities are already loaded loadActivities(profileId) should not call api', async () => {
      const apiSpy = jest.spyOn(store.api.business, 'getActivities');
      const activities = await store.profiles.loadActivities(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);
      expect(activities).toEqual(TEST_PROFILE.activities);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });

    it('Test if activities are not loaded yet loadActivities(profileId) should call api', async () => {
      store.profiles.businessById = jest.fn(() => ({
        ...TEST_PROFILE,
        activities: [],
      }));
      const apiSpy = jest.spyOn(store.api.business, 'getActivities');
      await store.profiles.loadActivities(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/business/11111/activities',
        { query: { access_token: undefined } }
      );
    });
  });

  describe('Profiles Store/loadTodos(profileId)', () => {
    it('Test if activities are already loaded loadTodos(profileId) should not call api', async () => {
      const apiSpy = jest.spyOn(store.api.business, 'getTodos');
      const todos = await store.profiles.loadTodos(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);
      expect(todos).toEqual(TEST_PROFILE.todos);

      expect(networkHelper.isConnected).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });

    it('Test if todos are not loaded yet loadTodos(profileId) should call api', async () => {
      store.profiles.businessById = jest.fn(() => ({
        ...TEST_PROFILE,
        todos: [],
      }));
      const apiSpy = jest.spyOn(store.api.business, 'getTodos');
      await store.profiles.loadTodos(11111);

      expect(store.profiles.businessById).toHaveBeenCalledTimes(1);
      expect(store.profiles.businessById).toHaveBeenCalledWith(11111);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/business/11111/todos',
        { query: { access_token: undefined } }
      );
    });
  });

  describe('Profiles Store/getAllOffers(id: number)', () => {
    it('Test if getAllOffers(id: number) call api endpoint', async () => {
      const apiSpy = jest.spyOn(store.api.profiles, 'getAllOffers');
      await store.profiles.getAllOffers(11111);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalled();
      expect(store.api.fetch).toHaveBeenCalledWith(
        '/api/rest/v1/profiles/11111/offers',
        { query: { access_token: undefined } }
      );
    });

    it('Test if gets id === undefined || null getAllOffers(id: number) should not call api', async () => {
      const apiSpy = jest.spyOn(store.api.profiles, 'getAllOffers');
      await store.profiles.getAllOffers(null);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(0);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(0);
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();

      await store.profiles.getAllOffers(undefined);

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(0);
      expect(networkHelper.loadFromApi).toHaveBeenCalledTimes(0);
      expect(apiSpy).not.toHaveBeenCalled();
      expect(store.api.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Profiles Store/setCurrentProfile(profile: Profile)', () => {
    it('Test if setCurrentProfile(profile: Profile) set right currentProfile', () => {
      store.profiles.setCurrentProfile(null);
      expect(store.profiles.currentProfile).toBeNull();

      store.profiles.setCurrentProfile(TEST_PROFILE);
      expect(mobx.toJS(store.profiles.currentProfile)).toEqual(TEST_PROFILE);
    });
  });
});