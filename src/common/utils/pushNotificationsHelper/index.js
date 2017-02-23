import type PayeverApi from './../index';
import type UserAccount
  from '../../../store/UserProfilesStore/models/UserAccount';
import PushNotificationsHelper from './PushNotificationsHelper';
import { log } from '../index';

let instance: PushNotificationsHelper = null;

export function createInstance(
  api: PayeverApi,
  userProfile: UserAccount
): PushNotificationsHelper {
  instance = new PushNotificationsHelper(api, userProfile);

  return instance;
}

export function getInstance(): PushNotificationsHelper {
  if (!instance) {
    log.error('Push notifications helper error while getting instance');
    throw new Error('Push notifications helper instance was not created');
  }

  return instance;
}