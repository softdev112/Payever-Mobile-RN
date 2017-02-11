import NotificationsIOS, {
  NotificationAction,
  NotificationCategory,
} from 'react-native-notifications';
import { Alert } from 'react-native';

const upvoteAction = new NotificationAction({
  activationMode: 'background',
  title: String.fromCodePoint(0x1F44D),
  identifier: 'UPVOTE_ACTION',
}, (action, completed) => {
  NotificationsIOS.log('ACTION RECEIVED');
  NotificationsIOS.log(JSON.stringify(action));

  completed();
});

const replyAction = new NotificationAction({
  activationMode: 'background',
  title: 'Reply',
  behavior: 'textInput',
  authenticationRequired: true,
  identifier: 'REPLY_ACTION',
}, (action, completed) => {
  console.log('ACTION RECEIVED');
  console.log(action);

  completed();
});

const cat = new NotificationCategory({
  identifier: 'SOME_CATEGORY',
  actions: [upvoteAction, replyAction],
  context: 'default',
});

async function onPushRegistered(deviceApi, userProfile, deviceToken) {
  console.log('Device Token Received: ' + deviceToken);

  // Send device token to server along side with device name
  await deviceApi.linkDeviceToken(userProfile, deviceToken);
}


function onPushKitRegistered(deviceToken) {
  console.log('Device Token Received Push Kit: ' + deviceToken);
}

function onNotificationReceivedForeground(notification) {
  console.log('Notification Received Foreground: '
    + JSON.stringify(notification));

  Alert.alert(
    'Alert Title',
    JSON.stringify(notification),
    [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ],
    { cancelable: false }
  );
}

function onNotificationReceivedBackground(notification) {
  NotificationsIOS.log('Notification Received Background: '
    + JSON.stringify(notification));

  const localNotification = NotificationsIOS.localNotification({
    alertBody: 'Received background notificiation!',
    alertTitle: 'Local Notification Title',
    alertAction: 'Click here to open',
    soundName: 'chime.aiff',
    category: 'SOME_CATEGORY',
    userInfo: notification.getData(),
  });

  console.log(localNotification);
  // if you want to fire the local notification 10 seconds later,
  // add the following line to the notification payload:
  //      fireDate: new Date(Date.now() + (10 * 1000)).toISOString()
  // NotificationsIOS.backgroundTimeRemaining(
  //  time => NotificationsIOS.log("remaining background time: " + time));
  // NotificationsIOS.cancelLocalNotification(localNotification);
}

function onNotificationOpened(notification) {
  console.log('Notification Opened: ' + JSON.stringify(notification));
}

export default function registerNotifications(api, userProfile) {
  NotificationsIOS.addEventListener(
    'remoteNotificationsRegistered',
    token => onPushRegistered(api, userProfile, token)
  );
  NotificationsIOS.requestPermissions([cat]);
  NotificationsIOS.consumeBackgroundQueue();
  NotificationsIOS.addEventListener('pushKitRegistered', onPushKitRegistered);
  NotificationsIOS.registerPushKit();
  NotificationsIOS.addEventListener(
    'notificationReceivedForeground',
    onNotificationReceivedForeground
  );
  NotificationsIOS.addEventListener(
    'notificationReceivedBackground',
    onNotificationReceivedBackground
  );
  NotificationsIOS.addEventListener('notificationOpened', onNotificationOpened);
}