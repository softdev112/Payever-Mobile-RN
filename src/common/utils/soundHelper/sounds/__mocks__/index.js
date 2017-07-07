import { Platform } from 'react-native';

export default Platform.select({
  ios: {
    sentMessage: 'sent_msg.mp3',
    receiveMessage: 'receive_msg.mp3',
    notification: 'notification.mp3',
  },
  android: {
    sentMessage: 'sent_msg.mp3',
    receiveMessage: 'receive_msg.mp3',
    notification: 'notification.mp3',
  },
});