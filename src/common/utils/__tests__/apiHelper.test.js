/* eslint-disable max-len, global-require */
import { Navigation } from 'react-native-navigation';
import { apiHelper, cacheHelper, networkHelper } from 'utils';
import ApiHelper from '../apiHelper/ApiHelper';

jest.mock('react-native-navigation', () => ({
  Navigation: {
    showModal: jest.fn(() => {}),
    dismissModal: jest.fn(() => {}),
  },
})).mock('react-native-logging')
  .mock('../networkHelper')
  .mock('../cacheHelper');

describe('Utils/apiHelper', () => {
  const store = {
    isLoading: false,
    error: '',
  };

  beforeEach(() => {
    networkHelper.isConnected.mockImplementation(() => true);
    networkHelper.loadFromApi.mockImplementation(
      () => ({ data: { a: 1, b: 'data' } })
    );

    cacheHelper.isCacheUpToDate.mockImplementationOnce(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('apiHelper/creation', () => {
    it('apiHelper creator should return instance of ApiHelper class', async () => {
      expect(apiHelper(() => new Promise(), store, false)).toBeInstanceOf(ApiHelper);
    });
  });

  describe('apiHelper/fetch logic', () => {
    it('apiHelper if cache not set and connection available it should call loadFromApi', async () => {
      await apiHelper(() => Promise.resolve({ data: 'data' }), store, false)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
    });

    it('apiHelper if cache not set and connection not available it should not call Navigation.showModal because showErrorPage = false', async () => {
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => new Promise(), store, false).promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper if cache not set and connection not available it should call Navigation.showModal because showErrorPage = true', async () => {
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => new Promise(), store, true).promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).not.toHaveBeenCalled();
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(Navigation.showModal).toHaveBeenCalledTimes(1);
      expect(Navigation.showModal.mock.calls.length).toBe(1);
      expect(Navigation.showModal.mock.calls[0].length).toBeGreaterThan(0);
      expect(Navigation.showModal.mock.calls[0][0].screen)
        .toBe('core.ErrorPage');
    });

    it('apiHelper if cache set and it is up to date and connection available it should not call loadFromApi', async () => {
      cacheHelper.loadFromCache.mockImplementationOnce(
        () => ({ data: '123' })
      );
      await apiHelper(() => new Promise(), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper if cache set and it is up to date and no connection available it should not call loadFromApi', async () => {
      cacheHelper.loadFromCache.mockImplementationOnce(
        () => ({ data: '123' })
      );
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => new Promise(), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper if cache set and it is up to date and connection available it should not call loadFromApi', async () => {
      cacheHelper.loadFromCache.mockImplementationOnce(
        () => ({ data: '123' })
      );
      await apiHelper(() => new Promise(), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper if cache set, but not available and connection available it should call loadFromApi', async () => {
      cacheHelper.loadFromCache.mockImplementationOnce(() => null);
      await apiHelper(() => Promise.resolve({ data: 'data' }), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.saveToCache).toHaveBeenCalled();
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });
  });

  describe('apiHelper/callbacks', () => {
    it('apiHelper complete callback should be called if it was set up and data were loaded successfully', async () => {
      const completeMockFn = jest.fn(() => {});
      await apiHelper(() => Promise.resolve({ data: 'data' }), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .complete(completeMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.saveToCache).toHaveBeenCalled();
      expect(completeMockFn).toHaveBeenCalledTimes(1);
      expect(completeMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } },
        ''
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper complete callback should be called if it was set up and data were NOT loaded successfully', async () => {
      const completeMockFn = jest.fn(() => {});
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => Promise.reject({ data: 'data' }), store, true)
        .complete(completeMockFn)
        .promise();

      expect(completeMockFn).toHaveBeenCalledTimes(1);
      expect(completeMockFn).toHaveBeenLastCalledWith(
        undefined,
        networkHelper.errorConnection
      );
    });

    it('apiHelper success callback should be called if data were loaded successfully', async () => {
      const successMockFn = jest.fn(() => {});
      await apiHelper(() => Promise.resolve({ data: 'data' }), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .success(successMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.saveToCache).toHaveBeenCalled();
      expect(successMockFn).toHaveBeenCalledTimes(1);
      expect(successMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } }
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper success callback should not be called if data were NOT loaded successfully', async () => {
      const successMockFn = jest.fn(() => {});
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => Promise.reject({ data: 'data' }), store, true)
        .success(successMockFn)
        .promise();

      expect(successMockFn).not.toHaveBeenCalled();
    });

    it('apiHelper error callback should NOT be called if data were loaded successfully', async () => {
      const errorMockFn = jest.fn(() => {});
      const successMockFn = jest.fn(() => {});
      await apiHelper(() => Promise.resolve({ data: 'data' }), store, true)
        .cache('cacheId', { lifetime: 3600 })
        .success(successMockFn)
        .error(errorMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(cacheHelper.loadFromCache).toHaveBeenCalledTimes(1);
      expect(cacheHelper.isCacheUpToDate).not.toHaveBeenCalled();
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(cacheHelper.saveToCache).toHaveBeenCalled();
      expect(errorMockFn).not.toHaveBeenCalled();
      expect(successMockFn).toHaveBeenCalledTimes(1);
      expect(successMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } }
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
    });

    it('apiHelper success callback should not be called if data were NOT loaded successfully', async () => {
      const errorMockFn = jest.fn(() => {});
      const successMockFn = jest.fn(() => {});
      networkHelper.isConnected.mockImplementationOnce(() => false);
      await apiHelper(() => Promise.reject({ data: 'data' }), store, true)
        .success(successMockFn)
        .error(errorMockFn)
        .promise();

      expect(successMockFn).not.toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenCalledTimes(1);
      expect(errorMockFn).toHaveBeenLastCalledWith(
        { error: networkHelper.errorConnection }
      );
    });
  });

  describe('apiHelper/promise', () => {
    it('apiHelper promise callback should resolve to a value which returns from success callback', async () => {
      const successMockFn = jest.fn(data => data);
      const result = await apiHelper(
        () => Promise.resolve(1),
        store,
        true
      ).success(successMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(successMockFn).toHaveBeenCalledTimes(1);
      expect(successMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } }
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
      expect(result).toEqual({ data: { a: 1, b: 'data' } });
    });

    it('apiHelper promise callback should resolve to true if success callback do not return anything', async () => {
      const successMockFn = jest.fn(() => {});
      const result = await apiHelper(
        () => Promise.resolve(1),
        store,
        true
      ).success(successMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(successMockFn).toHaveBeenCalledTimes(1);
      expect(successMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } }
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('apiHelper promise callback should resolve to a value which returns from error callback', async () => {
      const errorMockFn = jest.fn(error => error);
      const successMockFn = jest.fn(data => data);
      networkHelper.isConnected.mockImplementationOnce(() => false);
      const result = await apiHelper(() => Promise.reject({ data: 'data' }), store, true)
        .success(successMockFn)
        .error(errorMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(successMockFn).not.toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenLastCalledWith({
        error: networkHelper.errorConnection,
      });
      expect(Navigation.showModal).toHaveBeenCalled();
      expect(result).toEqual({ error: networkHelper.errorConnection });
    });

    it('apiHelper promise callback should resolve to false if error callback do not return anything', async () => {
      const errorMockFn = jest.fn(() => {});
      const successMockFn = jest.fn((data) => data);
      networkHelper.isConnected.mockImplementationOnce(() => false);
      const result = await apiHelper(() => Promise.reject({ data: 'data' }), store, true)
        .success(successMockFn)
        .error(errorMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).not.toHaveBeenCalled();
      expect(successMockFn).not.toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenLastCalledWith({
        error: networkHelper.errorConnection,
      });
      expect(Navigation.showModal).toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it('apiHelper promise callback should resolve to a value which returns from complete callback', async () => {
      const completeMockFn = jest.fn(data => data);
      const result = await apiHelper(
        () => Promise.resolve(1),
        store,
        true
      ).complete(completeMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(completeMockFn).toHaveBeenCalledTimes(1);
      expect(completeMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } },
        ''
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
      expect(result).toEqual({ data: { a: 1, b: 'data' } });
    });

    it('apiHelper promise callback should resolve to true if complete callback do not return anything', async () => {
      const completeMockFn = jest.fn(() => {});
      const result = await apiHelper(
        () => Promise.resolve(1),
        store,
        true
      ).complete(completeMockFn)
        .promise();

      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(completeMockFn).toHaveBeenCalledTimes(1);
      expect(completeMockFn).toHaveBeenLastCalledWith(
        { data: { a: 1, b: 'data' } },
        ''
      );
      expect(Navigation.showModal).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  describe('apiHelper/state', () => {
    it('apiHelper should set state.isLoading to true while resolving promise and return it to false', async () => {
      jest.useFakeTimers();

      networkHelper.loadFromApi.mockImplementationOnce(
        () => new Promise((res) => {
          setTimeout(() => res(1), 2000);
          expect(store.isLoading).toBe(true);
          jest.runOnlyPendingTimers();
        })
      );

      const successMockFn = jest.fn((data) => {
        expect(store.isLoading).toBe(true);
        return data;
      });

      expect(store.isLoading).toBe(false);
      await apiHelper(() => Promise.resolve(1), store, true)
        .success(successMockFn)
        .promise();

      expect(store.isLoading).toBe(false);
      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(successMockFn).toHaveBeenCalledTimes(1);
      expect(successMockFn).toHaveBeenLastCalledWith(1);

      jest.clearAllTimers();
    });

    it('apiHelper should set state error if there was errors while reading from api', async () => {
      jest.useFakeTimers();

      networkHelper.loadFromApi.mockImplementationOnce(
        () => new Promise((res, rej) => {
          setTimeout(() => rej(networkHelper.errorConnection), 2000);
          expect(store.isLoading).toBe(true);
          expect(store.error).toBe('');
          jest.runOnlyPendingTimers();
        })
      );

      const errorMockFn = jest.fn((data) => {
        expect(store.isLoading).toBe(true);
        return data;
      });

      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('');
      await apiHelper(() => Promise.resolve(1), store, true)
        .error(errorMockFn)
        .promise();

      expect(store.isLoading).toBe(false);
      expect(store.error).toBe(networkHelper.errorConnection);
      expect(networkHelper.isConnected).toHaveBeenCalledTimes(1);
      expect(networkHelper.loadFromApi).toHaveBeenCalled();
      expect(errorMockFn).toHaveBeenCalledTimes(1);
      expect(errorMockFn).toHaveBeenLastCalledWith({ error: networkHelper.errorConnection });

      jest.clearAllTimers();
    });
  });
});