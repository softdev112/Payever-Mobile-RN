/* eslint-disable max-len, global-require */
import { AsyncStorage } from 'react-native';
import { cacheHelper } from 'utils';

const CACHE_KEY = 'cache-key';
const LIFE_TIME = 200;
const data = {
  a: 'data',
  b: 2,
};

AsyncStorage.getItem = jest.fn(
  () => Promise.resolve({ CACHE_KEY: new Date() })
);
AsyncStorage.removeItem = jest.fn(() => Promise.resolve(1));
AsyncStorage.setItem = jest.fn(() => Promise.resolve(1));

describe('Utils/cacheHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheHelper/saveToCache', () => {
    it('saveToCache calls AsyncStorage.setItem with right params and cache should not be expired', () => {
      cacheHelper.saveToCache(CACHE_KEY, LIFE_TIME, data);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`,
        JSON.stringify(data)
      );

      cacheHelper.saveExpireData(CACHE_KEY, LIFE_TIME);
      expect(cacheHelper.isCacheUpToDate(CACHE_KEY, LIFE_TIME)).toBe(true);
    });

    it('saveToCache with cacheId === null should not call AsyncStorage.setItem', () => {
      cacheHelper.saveToCache(null, LIFE_TIME, data);
      cacheHelper.saveToCache(undefined, LIFE_TIME, data);
      cacheHelper.saveToCache('', LIFE_TIME, data);

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('cacheHelper/isCacheUpToDate', () => {
    it('isCacheUpToDate should return false if there is no cache for cacheId', () => {
      expect(
        cacheHelper.isCacheUpToDate(`notexist-${CACHE_KEY}`, LIFE_TIME)
      ).toBe(false);
    });

    it('isCacheUpToDate should return false if cacheId = null | undefined | empty string', () => {
      expect(cacheHelper.isCacheUpToDate(null, LIFE_TIME)).toBe(false);
      expect(cacheHelper.isCacheUpToDate(undefined, LIFE_TIME)).toBe(false);
      expect(cacheHelper.isCacheUpToDate('', LIFE_TIME)).toBe(false);
    });

    it('isCacheUpToDate should return false for expired lifetime', () => {
      cacheHelper.saveToCache(CACHE_KEY, LIFE_TIME, data);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`,
        JSON.stringify(data)
      );

      cacheHelper.saveExpireData(CACHE_KEY, LIFE_TIME);
      expect(
        cacheHelper.isCacheUpToDate(CACHE_KEY, -(LIFE_TIME + 2))
      ).toBe(false);
    });

    it('isCacheUpToDate should return true for just saved cache', () => {
      cacheHelper.saveToCache(CACHE_KEY, LIFE_TIME, data);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`,
        JSON.stringify(data)
      );

      cacheHelper.saveExpireData(CACHE_KEY, LIFE_TIME);
      expect(cacheHelper.isCacheUpToDate(CACHE_KEY, LIFE_TIME)).toBe(true);
    });
  });

  describe('cacheHelper/removeFromCache', () => {
    it('removeFromCache should call AsyncStorage.removeItem with right args', () => {
      cacheHelper.removeFromCache(CACHE_KEY);

      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`
      );
    });

    it('removeFromCache should remove cache data and expired data for cacheId', () => {
      AsyncStorage.setItem.mockImplementationOnce(() => {
        cacheHelper.saveExpireData(CACHE_KEY, LIFE_TIME);
        return Promise.resolve(1);
      });

      AsyncStorage.removeItem.mockImplementationOnce(() => {
        cacheHelper.saveExpireData(CACHE_KEY);
        return Promise.resolve(1);
      });

      cacheHelper.saveToCache(CACHE_KEY, LIFE_TIME, data);
      expect(cacheHelper.isCacheUpToDate(CACHE_KEY, LIFE_TIME)).toBe(true);

      cacheHelper.removeFromCache(CACHE_KEY);

      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.removeItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`
      );
      expect(cacheHelper.isCacheUpToDate(CACHE_KEY, LIFE_TIME)).toBe(false);
    });

    it('removeFromCache if cacheId = null | undefined | empty string should not throw exception', () => {
      expect(() => cacheHelper.removeFromCache(null)).not.toThrow();
      expect(() => cacheHelper.removeFromCache(undefined)).not.toThrow();
      expect(() => cacheHelper.removeFromCache('')).not.toThrow();
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('cacheHelper/loadFromCache', () => {
    it('loadFromCache should call AsyncStorage.getItem with right args', () => {
      cacheHelper.loadFromCache(CACHE_KEY);

      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.getItem).toHaveBeenLastCalledWith(
        `cache:${CACHE_KEY}`
      );
    });

    it('loadFromCache should do not call AsyncStorage.getItem and return null if cacheId = null | undefined | empty string', () => {
      expect(() => cacheHelper.loadFromCache(null)).not.toThrow();
      expect(() => cacheHelper.loadFromCache(undefined)).not.toThrow();
      expect(() => cacheHelper.loadFromCache('')).not.toThrow();

      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    });
  });
});