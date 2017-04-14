import { Platform } from 'react-native';
import Sound from 'react-native-sound';
import { log } from '../index';
import Sounds from './sounds';
import UserSettings, { TimePoint }
  from '../../../store/communication/models/UserSettings';

class SoundHelper {
  currentUserSettings: UserSettings = null;

  setUserSettings(settings: UserSettings) {
    this.currentUserSettings = settings;
  }

  playNotification() {
    playSound(Sounds.notification, this.currentUserSettings);
  }

  playMsgReceive() {
    playSound(Sounds.receiveMessage, this.currentUserSettings);
  }

  playMsgSent() {
    playSound(Sounds.sentMessage, this.currentUserSettings);
  }
}

/**
 * Plays sound
 * @param soundToPlay - For iOS it's require(soundFileName)
 * for Android it's soundFileName
 * @param settings - User settings allowing sound and setting volume
 */
function playSound(soundToPlay, settings: UserSettings = null) {
  const { silentPeriodStart: from, silentPeriodStop: to } = settings;
  if (settings
    && (!settings.notificationSound || isNoDisturbPeriod(from, to))) {
    return;
  }

  const volume = settings && (settings.notificationVolume / 100);
  let sound;
  if (Platform.OS === 'ios') {
    sound = new Sound(soundToPlay, (err) => {
      if (err) log.error(err);
      sound.setVolume(volume || 0.5);
      sound.play(() => sound.release());
    });
  } else {
    sound = new Sound(soundToPlay, Sound.MAIN_BUNDLE, (err) => {
      if (err) log.error(err);
      sound.setVolume(volume || 0.5);
      sound.play(() => sound.release());
    });
  }
}

/**
 * Return if current time inside no disturb period
 * @param from - No disturb period start time
 * @param to - No disturb perios end time
 */
function isNoDisturbPeriod(from: TimePoint, to: TimePoint): boolean {
  const date = new Date();
  const currentHour = date.getUTCHours();
  const currentMinute = date.getUTCMinutes();

  if (from.hour < to.hour) {
    if (currentHour === from.hour) {
      return currentMinute >= from.minute;
    } else if (currentHour === to.hour) {
      return currentMinute <= to.minute;
    }

    return currentHour > from.hour && currentHour <= to.hour;
  } else if (from.hour === to.hour) {
    return (from.minute < to.minute && currentMinute >= from.minute
      && currentMinute <= to.minute);
  } else if ((currentHour > from.hour && currentHour > 0)
    || (currentHour === from.hour && currentMinute > from.minute)) {
    return true;
  } else if ((currentHour < to.hour && currentHour >= 0)
    || (currentHour === to.hour && currentHour <= to.minute)) {
    return true;
  }

  return false;
}

export default new SoundHelper();