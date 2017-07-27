/* eslint-disable max-len, global-require */
import { soundHelper } from 'utils';
import Sound from 'react-native-sound';
import { soundHelperData } from '../__tests__/data';

describe('Utils/soundHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('soundHelper/main functions', () => {
    it('setUserSettings(settings: UserSettings) should set settings and do not throw error', () => {
      const { settingsObject1 } = soundHelperData;
      expect(() => soundHelper.setUserSettings(settingsObject1)).not.toThrow();
      expect(() => soundHelper.setUserSettings(undefined)).not.toThrow();
      expect(() => soundHelper.setUserSettings(null)).not.toThrow();
    });

    it('playNotification() should call playSound using test settings object №14 not in silent period', () => {
      const { settingsObject14 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject14.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject14.testMinute);

      soundHelper.setUserSettings(settingsObject14);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });

    it('playMsgReceive() should call playSound using test settings object №14 not in silent period', () => {
      const { settingsObject14 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject14.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject14.testMinute);

      soundHelper.setUserSettings(settingsObject14);
      soundHelper.playMsgReceive();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'receive_msg.mp3', expect.any(Function)
      );
    });

    it('playMsgSent() should call playSound using test settings object №14 not in silent period', () => {
      const { settingsObject14 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject14.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject14.testMinute);

      soundHelper.setUserSettings(settingsObject14);
      soundHelper.playMsgSent();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'sent_msg.mp3', expect.any(Function)
      );
    });

    it('playMsgSent() should NOT call playSound if settings === null and should NOT throw error', () => {
      soundHelper.setUserSettings(null);
      expect(() => soundHelper.playMsgSent()).not.toThrow();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('playMsgSent() should NOT call playSound if settings.from === null and should NOT throw error', () => {
      const { fromNullSettings } = soundHelperData;

      soundHelper.setUserSettings(fromNullSettings);
      expect(() => soundHelper.playMsgSent()).not.toThrow();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('playMsgSent() should NOT call playSound if settings.to === null and should NOT throw error', () => {
      const { toNullSettings } = soundHelperData;

      soundHelper.setUserSettings(toNullSettings);
      expect(() => soundHelper.playMsgSent()).not.toThrow();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('playMsgSent() should NOT call playSound if settings.notificationSound === false', () => {
      const { soundOffSettings } = soundHelperData;

      soundHelper.setUserSettings(soundOffSettings);
      expect(() => soundHelper.playMsgSent()).not.toThrow();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('playMsgSent() should call playSound and NOT throw error if settings.notificationVolume === undefined', () => {
      const { soundVolumeUndefSettings } = soundHelperData;

      soundHelper.setUserSettings(soundVolumeUndefSettings);
      expect(() => soundHelper.playMsgSent()).not.toThrow();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith('sent_msg.mp3', expect.any(Function));
    });
  });

  describe('soundHelper tests with different settings to test silent period detection', () => {
    it('soundHelper should NOT call playSound using test settings object №1 in silent period', () => {
      const { settingsObject1 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject1.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject1.testMinute);

      soundHelper.setUserSettings(settingsObject1);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №2 in silent period', () => {
      const { settingsObject2 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject2.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject2.testMinute);

      soundHelper.setUserSettings(settingsObject2);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №3 in silent period', () => {
      const { settingsObject3 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject3.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject3.testMinute);

      soundHelper.setUserSettings(settingsObject3);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №4 in silent period', () => {
      const { settingsObject4 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject4.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject4.testMinute);

      soundHelper.setUserSettings(settingsObject4);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №5 in silent period', () => {
      const { settingsObject5 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject5.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject5.testMinute);

      soundHelper.setUserSettings(settingsObject5);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №6 in silent period', () => {
      const { settingsObject6 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject6.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject6.testMinute);

      soundHelper.setUserSettings(settingsObject6);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №7 in silent period', () => {
      const { settingsObject7 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject7.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject7.testMinute);

      soundHelper.setUserSettings(settingsObject7);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №8 in silent period', () => {
      const { settingsObject8 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject8.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject8.testMinute);

      soundHelper.setUserSettings(settingsObject8);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should NOT call playSound using test settings object №9 in silent period', () => {
      const { settingsObject9 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject9.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject9.testMinute);

      soundHelper.setUserSettings(settingsObject9);
      soundHelper.playNotification();

      expect(Sound).not.toHaveBeenCalled();
    });

    it('soundHelper should call playSound using test settings object №10 NOT in silent period', () => {
      const { settingsObject10 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject10.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject10.testMinute);

      soundHelper.setUserSettings(settingsObject10);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });

    it('soundHelper should call playSound using test settings object №11 NOT in silent period', () => {
      const { settingsObject11 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject11.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject11.testMinute);

      soundHelper.setUserSettings(settingsObject11);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });

    it('soundHelper should call playSound using test settings object №12 NOT in silent period', () => {
      const { settingsObject12 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject12.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject12.testMinute);

      soundHelper.setUserSettings(settingsObject12);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });

    it('soundHelper should call playSound using test settings object №13 NOT in silent period', () => {
      const { settingsObject13 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject13.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject13.testMinute);

      soundHelper.setUserSettings(settingsObject13);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });

    it('soundHelper should call playSound using test settings object №14 NOT in silent period', () => {
      const { settingsObject14 } = soundHelperData;
      jest.spyOn(Date.prototype, 'getUTCHours')
        .mockImplementationOnce(() => settingsObject14.testHour);
      jest.spyOn(Date.prototype, 'getUTCMinutes')
        .mockImplementationOnce(() => settingsObject14.testMinute);

      soundHelper.setUserSettings(settingsObject14);
      soundHelper.playNotification();

      expect(Sound).toHaveBeenCalled();
      expect(Sound).toHaveBeenCalledWith(
        'notification.mp3', expect.any(Function)
      );
    });
  });
});