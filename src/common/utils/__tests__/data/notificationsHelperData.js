export default {
  notificationIOS: {
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
  },

  notificationWithoutData: {
    _alert: 'Hello world!!!!',
    _sound: 'Sound',
    _type: 'offer',
    _badge: 0,
    _data: {},
  },
};