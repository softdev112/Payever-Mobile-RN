import NotificationsIOS, {
  NotificationsAndroid, PendingNotifications,
} from 'react-native-notifications';
import { AppState, Platform } from 'react-native';
import { log } from 'utils';

import type PayeverApi from './../index';
import type UserAccount
  from '../../../store/profiles/models/UserAccount';
import handleNotification from './notificationHandlers';

export default class PushNotificationsHelper {
  api: PayeverApi;
  userProfile: UserAccount;

  constructor(api, userProfile) {
    this.api = api;
    this.userProfile = userProfile;
  }

  async onPushNotificationsRegistered(deviceToken) {
    // Send device token to server along side with device name
    log.debug('Device token received:', deviceToken);
    await this.api.device.linkDeviceToken(this.userProfile, deviceToken);
  }

  onNotificationReceivedForeground(notification) {
    log.debug('Receive foreground notification: ', notification);
    handleNotification(notification, { isBackground: false });
  }

  onNotificationReceivedBackground(notification) {
    log.debug('Receive background notification: ', notification);
    handleNotification(notification, { isBackground: true });
  }

  onNotificationOpened(notification) {
    log.debug('On notification opened: ', notification);
    handleNotification(notification, { isOpened: true });
  }

  onNotificationReceivedAndroid(notification) {
    log.debug('Receive Android notification:', AppState.currentState);

    if (AppState.currentState === 'active') {
      this.onNotificationReceivedForeground(notification);
    } else {
      this.onNotificationReceivedBackground(notification);
    }
  }

  async registerNotifications() {
    if (Platform.OS === 'ios') {
      NotificationsIOS.addEventListener(
        'remoteNotificationsRegistered',
        ::this.onPushNotificationsRegistered
      );
      NotificationsIOS.requestPermissions();
      NotificationsIOS.consumeBackgroundQueue();

      NotificationsIOS.addEventListener(
        'notificationReceivedForeground',
        ::this.onNotificationReceivedForeground
      );
      NotificationsIOS.addEventListener(
        'notificationReceivedBackground',
        ::this.onNotificationReceivedBackground
      );
      NotificationsIOS.addEventListener(
        'notificationOpened',
        ::this.onNotificationOpened
      );
    } else {
      NotificationsAndroid.setRegistrationTokenUpdateListener(
        ::this.onPushNotificationsRegistered
      );
      NotificationsAndroid.setNotificationOpenedListener(
        ::this.onNotificationOpened
      );
      NotificationsAndroid.setNotificationReceivedListener(
        ::this.onNotificationReceivedAndroid
      );
      NotificationsAndroid.refreshToken();

      const initNotification = await PendingNotifications
        .getInitialNotification();
      if (initNotification) {
        this.onNotificationOpened(initNotification);
      }
    }
  }
}