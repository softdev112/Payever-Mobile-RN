import { AsyncStorage } from 'react-native';
import * as log from '../log';

let expireData = {};
loadExpireData();

export function isCacheUpToDate(cacheId, lifeTimeSeconds) {
  const date = expireData ? expireData[cacheId] : null;
  if (!date) {
    return false;
  }

  const secondsPassed = (new Date() - new Date(date)) / 1000;
  return secondsPassed < lifeTimeSeconds;
}

export function loadFromCache(cacheId) {
  return AsyncStorage.getItem(cacheKey(cacheId))
    .then(result => JSON.parse(result))
    .catch(() => null);
}

export function saveToCache(cacheId, lifeTimeSeconds, data) {
  AsyncStorage.setItem(cacheKey(cacheId), JSON.stringify(data))
    .then(() => {
      if (lifeTimeSeconds) {
        saveExpireData(cacheId, lifeTimeSeconds);
      }
    })
    .catch(log.warn);
}

export function removeFromCache(cacheId) {
  AsyncStorage.removeItem(cacheKey(cacheId))
    .then(() => saveExpireData(cacheId))
    .catch(log.warn);
}

function loadExpireData() {
  AsyncStorage.getItem('cache-expire')
    .then((result) => expireData = JSON.parse(result) || {})
    .catch(() => expireData = {});
}

function saveExpireData(cacheId, lifeTimeSeconds) {
  if (lifeTimeSeconds) {
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + lifeTimeSeconds);
    expireData[cacheId] = expiredAt;
  } else {
    delete expireData[cacheId];
  }

  AsyncStorage.setItem('cache-expire', JSON.stringify(expireData))
    .catch(log.error);
}

function cacheKey(cacheId) {
  return 'cache:' + cacheId;
}