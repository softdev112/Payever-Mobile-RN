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
    Object.assign(this, data);
  }
}

type TimePoint = {
  hour: number;
  minute: number;
};