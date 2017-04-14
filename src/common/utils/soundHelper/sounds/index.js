import { Platform } from 'react-native';

/* eslint-disable global-require */
const sentMessage = require('./sent_msg.mp3');
const receiveMessage = require('./receive_msg.mp3');
const notification = require('./notification.mp3');
/* eslint-enable global-require */

export default Platform.select({
  ios: {
    sentMessage,
    receiveMessage,
    notification,
  },
  android: {
    sentMessage: 'sent_msg.mp3',
    receiveMessage: 'receive_msg.mp3',
    notification: 'notification.mp3',
  },
});