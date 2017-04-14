export default class UserSettings {
  id: number;
  notificationDesktop: boolean;
  notificationPreview: boolean;
  notificationSound: boolean;
  notificationVolume: number;
  silentPeriodState: boolean;
  silentPeriodStart: TimePoint;
  silentPeriodStop: TimePoint;

  constructor(data) {
    if (data) {
      const { hour: fromHour, minute: fromMinute } = data.silentPeriodStart;
      const { hour: toHour, minute: toMinute } = data.silentPeriodStop;

      data.silentPeriodStart.hour = +fromHour;
      data.silentPeriodStart.minute = +fromMinute;
      data.silentPeriodStop.hour = +toHour;
      data.silentPeriodStop.minute = +toMinute;
    }

    Object.assign(this, data);
  }
}

export type TimePoint = {
  hour: number;
  minute: number;
};