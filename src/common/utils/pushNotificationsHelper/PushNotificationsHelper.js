import NotificationsIOS from 'react-native-notifications';
import { Navigation } from 'react-native-navigation';
import { Alert } from 'react-native';

import type PayeverApi from './../index';
import type UserAccount
  from '../../../store/UserProfilesStore/models/UserAccount';
import * as log from '../log';

export default class PushNotificationsHelper {
  api: PayeverApi;
  userProfile: UserAccount;

  constructor(api, userProfile) {
    this.api = api;
    this.userProfile = userProfile;
  }

  async onPushRegistered(deviceToken) {
    console.log('Device Token Received: ' + deviceToken);

    // Send device token to server along side with device name
    await this.api.device.linkDeviceToken(this.userProfile, deviceToken);
  }

  onPushKitRegistered(deviceToken) {
    console.log('Device Token Received Push Kit: ' + deviceToken);
  }

  onNotificationReceivedForeground(notification) {
    Alert.alert(
      'New Offer Received',
      // eslint-disable-next-line no-underscore-dangle
      notification._alert, // JSON.stringify(notification),
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

  onNotificationReceivedBackground(notification) {
    NotificationsIOS.log('Notification Received Background: '
      + JSON.stringify(notification));

    const localNotification = NotificationsIOS.localNotification({
      alertBody: 'Received background notificiation!',
      alertTitle: 'Local Notification Title',
      alertAction: 'Click here to open',
      soundName: 'chime.aiff',
      category: 'SOME_CATEGORY',
      userInfo: notification.getData(),
      fireDate: new Date(Date.now() + 1000).toISOString(),
    });

    console.log(localNotification);
    // if you want to fire the local notification 10 seconds later,
    // add the following line to the notification payload:
    //      fireDate: new Date(Date.now() + (10 * 1000)).toISOString()
    // NotificationsIOS.backgroundTimeRemaining(
    //  time => NotificationsIOS.log('remaining background time: ' + time));
    // NotificationsIOS.cancelLocalNotification(localNotification);
  }

  onNotificationOpened(notification: Notification) {
    console.log('Notification Opened: ' + JSON.stringify(notification));
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
      screen: 'communication.OfferPreview',
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
      'pushKitRegistered',
      ::this.onPushKitRegistered
    );
    NotificationsIOS.registerPushKit();
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