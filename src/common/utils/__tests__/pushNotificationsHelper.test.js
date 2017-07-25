/* eslint-disable max-len, global-require */
import { Navigation } from 'react-native-navigation';
import { pushNotificationsHelper } from 'utils';
import { AppState, Platform } from 'react-native';
import NotificationsIOS, {
  NotificationsAndroid, PendingNotifications,
} from 'react-native-notifications';
import PushNotificationsHelper
  from '../pushNotificationsHelper/PushNotificationsHelper';
import * as handlers from '../pushNotificationsHelper/notificationHandlers';
import Store from '../../../store';
import config from '../../../config';
import { profilesList } from '../../../store/profiles/__tests__/data';
import UserAccount from '../../../store/profiles/models/UserAccount';

jest.mock('../../../store/auth')
  .mock('AppState', () => ({}))
  .mock('Platform', () => ({
    select: jest.fn(() => {}),
    OS: 'ios',
  }))
  .mock('react-native-device-info', () => ({
    getUniqueID: jest.fn(() => 11111),
    getBrand: jest.fn(() => 'Brand'),
    getModel: jest.fn(() => 'Phone'),
  }))
  .mock('react-native-notifications', () => ({
    addEventListener: jest.fn(),
    requestPermissions: jest.fn(),
    consumeBackgroundQueue: jest.fn(),
    NotificationsAndroid: {
      setRegistrationTokenUpdateListener: jest.fn(),
      setNotificationOpenedListener: jest.fn(),
      setNotificationReceivedListener: jest.fn(),
      refreshToken: jest.fn(),
    },
    PendingNotifications: {
      getInitialNotification: jest.fn(() => ({ data: 'data' })),
    },
  }));

const notificationIOS = {
  _alert: 'Hello world!!!!',
  _sound: 'Sound',
  _type: 'offer',
  _badge: 0,
  _data: {
    parameters: {
      type: 'offer',
      subtype: 'offer',
      data: {
        offer: 11111,
      },
    },
  },
};

describe('Utils/pushNotificationsHelper', () => {
  let store;
  let user;

  beforeAll(() => {
    store = new Store(config);
    user = new UserAccount(profilesList.private.user);
    Navigation.showModal = jest.fn();
    Navigation.showInAppNotification = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pushNotificationsHelper/getInstance()', () => {
    // It should be the first test before instance of pushNotificationsHelper
    // will be created
    it('getInstance should throw error if instance was NOT created before', () => {
      expect(() => pushNotificationsHelper.getInstance())
        .toThrowError('Push notifications helper was not created');
    });

    it('getInstance should return instance of PushNotificationHelper class if it was created before', () => {
      pushNotificationsHelper.createInstance(store.api, user);
      const pushInstance = pushNotificationsHelper.getInstance();

      expect(pushInstance).not.toBeNull();
      expect(pushInstance).toBeInstanceOf(PushNotificationsHelper);
    });
  });

  describe('pushNotificationsHelper/createInstance(api, userProfile)', () => {
    it('createInstance should create and return an instance of PushNotificationHelper class if arguments != null', () => {
      const pushsHelper = pushNotificationsHelper.createInstance(store.api, user);
      expect(pushsHelper).toBeInstanceOf(PushNotificationsHelper);
    });

    it('createInstance should return null if arguments === null', () => {
      let pushsHelper = pushNotificationsHelper.createInstance(null, user);
      expect(pushsHelper).toBeNull();

      pushsHelper = pushNotificationsHelper.createInstance(store.api, null);
      expect(pushsHelper).toBeNull();
    });
  });

  describe('PushNotificationsHelper/class functions', () => {
    it('onPushNotificationsRegistered(deviceToken) should call proper device api endpoint', async () => {
      const { api } = store;
      const apiSpy = jest.spyOn(api.device, 'linkDeviceToken');
      const postSpy = jest.spyOn(api, 'post');
      api.fetch = jest.fn();

      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      await PushNotificationsHelper.prototype
        .onPushNotificationsRegistered.call(pushHelper, 'Token');

      expect(apiSpy).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(expect.any(Object), 'Token');
      expect(postSpy).toHaveBeenCalled();
      expect(postSpy).toHaveBeenCalledWith(
        '/device/link',
        {
          email: 'payevertest1@gmail.com',
          emailEnabled: false,
          label: 'Brand-Phone',
          phone: '+12345678900',
          platform: expect.any(String),
          pushEnabled: true,
          smsEnabled: false,
          token: 'Token',
          udid: 11111,
        },
        {
          headers: {
            token: undefined,
          },
        }
      );
      expect(api.fetch).toHaveBeenCalled();
      expect(api.fetch).toHaveBeenCalledWith(
        '/device/link',
        expect.any(Object)
      );
    });

    it('onNotificationReceivedForeground(notification) should call handleNotification(notification, { isBackground: false })', () => {
      const handleNotificationSpy = jest.spyOn(handlers, 'default');

      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .onNotificationReceivedForeground.call(pushHelper, notificationIOS);

      expect(handleNotificationSpy).toHaveBeenCalled();
      expect(handleNotificationSpy).toHaveBeenCalledWith(
        notificationIOS,
        { isBackground: false }
      );
      expect(Navigation.showInAppNotification).toHaveBeenCalled();
      expect(Navigation.showInAppNotification).toHaveBeenCalledWith(
        {
          animationType: 'none',
          navigatorButtons: expect.any(Object),
          navigatorStyle: expect.any(Object),
          passProps: {
            action: expect.any(Function),
            message: 'Hello world!!!!',
          },
          screen: 'core.PushNotification',
          title: 'Hello world!!!!',
        }
      );
    });

    it('onNotificationReceivedBackground(notification) should call handleNotification(notification, { isBackground: true })', () => {
      const handleNotificationSpy = jest.spyOn(handlers, 'default');

      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .onNotificationReceivedBackground.call(pushHelper, notificationIOS);

      expect(handleNotificationSpy).toHaveBeenCalled();
      expect(handleNotificationSpy).toHaveBeenCalledWith(
        notificationIOS,
        { isBackground: true }
      );
      expect(Navigation.showInAppNotification).toHaveBeenCalled();
      expect(Navigation.showInAppNotification).toHaveBeenCalledWith(
        {
          animationType: 'none',
          navigatorButtons: expect.any(Object),
          navigatorStyle: expect.any(Object),
          passProps: {
            action: expect.any(Function),
            message: 'Hello world!!!!',
          },
          screen: 'core.PushNotification',
          title: 'Hello world!!!!',
        }
      );
    });

    it('onNotificationOpened(notification) should call handleNotification(notification, { isOpened: true }) and call Navigation.showModal', () => {
      const handleNotificationSpy = jest.spyOn(handlers, 'default');

      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .onNotificationOpened.call(pushHelper, notificationIOS);

      expect(handleNotificationSpy).toHaveBeenCalled();
      expect(handleNotificationSpy).toHaveBeenCalledWith(
        notificationIOS,
        { isOpened: true }
      );
      expect(Navigation.showInAppNotification).not.toHaveBeenCalled();
      expect(Navigation.showModal).toHaveBeenCalled();
      expect(Navigation.showModal).toHaveBeenCalledWith(
        {
          animationType: 'slide-up',
          navigatorButtons: expect.any(Object),
          navigatorStyle: expect.any(Object),
          passProps: {
            offerId: 11111,
          },
          screen: 'marketing.ViewOffer',
          title: 'Got an Offer:',
        }
      );
    });

    it('onNotificationReceivedAndroid(notification) should call onNotificationReceivedForeground if AppState.currentState === active', () => {
      const receivedForegroundSpy = jest.spyOn(
        PushNotificationsHelper.prototype, 'onNotificationReceivedForeground'
      );
      const receivedBackgroundSpy = jest.spyOn(
        PushNotificationsHelper.prototype, 'onNotificationReceivedBackground'
      );

      AppState.currentState = 'active';
      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .onNotificationReceivedAndroid.call(pushHelper, notificationIOS);

      expect(receivedForegroundSpy).toHaveBeenCalled();
      expect(receivedBackgroundSpy).not.toHaveBeenCalled();
    });

    it('onNotificationReceivedAndroid(notification) should call onNotificationReceivedBackground if AppState.currentState !== active', () => {
      const receivedForegroundSpy = jest.spyOn(
        PushNotificationsHelper.prototype, 'onNotificationReceivedForeground'
      );
      const receivedBackgroundSpy = jest.spyOn(
        PushNotificationsHelper.prototype, 'onNotificationReceivedBackground'
      );

      AppState.currentState = 'background';
      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .onNotificationReceivedAndroid.call(pushHelper, notificationIOS);

      expect(receivedForegroundSpy).not.toHaveBeenCalled();
      expect(receivedBackgroundSpy).toHaveBeenCalled();
    });

    it('registerNotifications() should add right listeners for iOS', () => {
      Platform.OS = 'ios';
      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      PushNotificationsHelper.prototype
        .registerNotifications.call(pushHelper);

      expect(NotificationsIOS.addEventListener).toHaveBeenCalledTimes(4);

      expect(NotificationsIOS.addEventListener.mock.calls[0])
        .toEqual(['remoteNotificationsRegistered', expect.any(Function)]);

      expect(NotificationsIOS.addEventListener.mock.calls[1])
        .toEqual(['notificationReceivedForeground', expect.any(Function)]);

      expect(NotificationsIOS.addEventListener.mock.calls[2])
        .toEqual(['notificationReceivedBackground', expect.any(Function)]);

      expect(NotificationsIOS.addEventListener.mock.calls[3])
        .toEqual(['notificationOpened', expect.any(Function)]);

      expect(NotificationsIOS.requestPermissions).toHaveBeenCalled();
      expect(NotificationsIOS.consumeBackgroundQueue).toHaveBeenCalled();
    });

    it('registerNotifications() should add right listeners for Android', async () => {
      const onNotifOpenSpy = jest.spyOn(
        PushNotificationsHelper.prototype,
        'onNotificationOpened'
      );

      Platform.OS = 'android';
      const pushHelper = pushNotificationsHelper
        .createInstance(store.api, user);
      await PushNotificationsHelper.prototype
        .registerNotifications.call(pushHelper);

      expect(NotificationsAndroid.setRegistrationTokenUpdateListener)
        .toHaveBeenCalled();
      expect(NotificationsAndroid.setRegistrationTokenUpdateListener)
        .toHaveBeenCalledWith(expect.any(Function));

      expect(NotificationsAndroid.setNotificationOpenedListener)
        .toHaveBeenCalled();
      expect(NotificationsAndroid.setNotificationOpenedListener)
        .toHaveBeenCalledWith(expect.any(Function));

      expect(NotificationsAndroid.setNotificationReceivedListener)
        .toHaveBeenCalled();
      expect(NotificationsAndroid.setNotificationReceivedListener)
        .toHaveBeenCalledWith(expect.any(Function));

      expect(NotificationsAndroid.refreshToken).toHaveBeenCalled();
      expect(PendingNotifications.getInitialNotification).toHaveBeenCalled();
      expect(onNotifOpenSpy).toHaveBeenCalled();
      expect(onNotifOpenSpy).toHaveBeenCalledWith({ data: 'data' });
    });
  });
});