import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import { log } from 'utils';

export default function handleNotification(
  notification: NotifIOS | NotifAndroid,
  options: Options
) {
  /* eslint-disable no-underscore-dangle */
  let parameters = null;
  try {
    parameters = Platform.OS === 'ios'
      ? notification._data.parameters
      : JSON.parse(notification.data.parameters);
  } catch (error) {
    log.error(error);
    return;
  }

  if (options.isBackground) {
    // processNotificationData(parameters);
    return;
  }

  // Foreground show notification to user with
  // question does he want to see it
  const message = Platform.OS === 'ios'
    ? notification._alert : 'Receive Notification';

  Navigation.showInAppNotification({
    screen: 'core.PushNotification',
    title: message,
    passProps: {
      message,
      action: () => processNotificationData(parameters),
    },
    navigatorStyle: {
      screenBackgroundColor: 'rgba(0,0,0,0.0)',
    },
    navigatorButtons: {},
    animationType: 'none',
  });

  /* eslint-enable no-underscore-dangle */
}

function processNotificationData(params: NotificationParams) {
  const { subtype, data } =  params;

  if (subtype === 'offer') {
    openOffer(data.offer);
  } else {
    log.warn('Unrecognized notification type');
  }
}

function openOffer(id) {
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

type Options = {
  isBackground: boolean;
};

type NotificationParams = {
  parameters: {
    type: string;
    subtype: string;
    data: Object;
  };
};

type NotifIOS = {
  _alert: string;
  _sound: string;
  _type: string;
  _badge: number;
  _data: NotificationParams;
};

type NotifAndroid = {
  data: {
    collapse_key: string;
    'google.message_id': string;
    'google.sent_time': string;
    parameters: string;
    notification: Object;
  };
};