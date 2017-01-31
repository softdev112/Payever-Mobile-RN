/**
 * Created by Elf on 30.01.2017.
 */
const mainProperties = [
  {
    type: 'checkbox',
    prefName: 'notificationDesktop',
    title: 'Desktop Notifications',
    icon: 'icon-mac-24',
  },
  {
    type: 'checkbox',
    prefName: 'notificationPreview',
    title: 'Message Preview',
    icon: 'icon-mail-2-16',
  },
  {
    type: 'switchable-slider',
    checkBox: {
      prefName: 'notificationSound',
      title: 'Sound Notifications',
      icon: 'icon-check2-16',
    },
    slider: {
      prefName: 'notificationVolume',
      min: 0,
      max: 100,
      title: 'Sound Volume',
      icon: 'icon-check2-16',
    },
  },
  {
    type: 'switchable-time-period',
    checkBox: {
      prefName: 'silentPeriodState',
      title: 'Do not disturb period',
      icon: 'icon-check2-16',
    },
    timePeriod: {
      title: 'Select time period during which desktop and sound' +
        'notifications will not be shown.',
      icon: 'icon-check2-16',
      from: {
        prefName: 'silentPeriodStart',
        hour: 0,
        minute: 0,
      },
      to: {
        prefName: 'silentPeriodStop',
        hour: 0,
        minute: 0,
      },
    },
  },
];

export default mainProperties;