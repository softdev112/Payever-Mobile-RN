import NotificationsIOS from 'react-native-notifications';
import { Navigation } from 'react-native-navigation';
import { Alert } from 'react-native';

import type PayeverApi from './../index';
import type UserAccount
  from '../../../store/UserProfilesStore/models/UserAccount';
import { log } from '../index';

export default class PushNotificationsHelper {
  api: PayeverApi;
  userProfile: UserAccount;

  constructor(api, userProfile) {
    this.api = api;
    this.userProfile = userProfile;
  }

  async onPushRegistered(deviceToken) {
    // Send device token to server along side with device name
    await this.api.device.linkDeviceToken(this.userProfile, deviceToken);
  }

  onNotificationReceivedForeground(notification) {
    Alert.alert(
      'New Offer Received',
      // eslint-disable-next-line no-underscore-dangle
      notification._alert,
      [
        {
          text: 'Show Offer',
          onPress: () => this.handlePushNotification(notification),
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  }

  onNotificationReceivedBackground(notification: Notification) {
    console.log('Receive background notification: ', notification);
  }

  onNotificationOpened(notification: Notification) {
    this.handlePushNotification(notification);
  }

  handlePushNotification(notification: Notification) {
    // eslint-disable-next-line no-underscore-dangle
    const { subtype, data } =  notification._data.parameters;
    if (subtype === 'offer') {
      this.openOffer(data.offer);
    } else {
      log.warn('Unrecognized notification type');
    }
  }

  async openOffer(id) {
    // Go to offer preview
    Navigation.showModal({
      screen: 'marketing.ViewOffer',
      title: 'Got an Offer:',
      passProps: {
        offerId: id,
      },
      navigatorStyle: {},
      navigatorButtons: {},
      animationType: 'slide-up',
    });
  }

  registerNotifications() {
    NotificationsIOS.addEventListener(
      'remoteNotificationsRegistered',
      ::this.onPushRegistered
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
  }
}

type Notification = {
  _data: {
    parameters: {
      type: string;
      subtype: string;
      data: Object;
    };
  };
  _badge: number;
  _alert: string;
  _sound: string;
  _type: string;
};