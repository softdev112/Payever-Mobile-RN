import DeviceInfo from 'react-native-device-info';

import type PayeverApi from './index';
import type UserAccount from '../../store/UserProfilesStore/models/UserAccount';

export default class DeviceApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  async linkDeviceToken(
    userProfile: UserAccount,
    deviceToken: string
  ): Promise<ApiResp> {
    const userDeviceInfo: UserDeviceInfo = {
      email: userProfile.email,
      phone: '+12345678900',
      pushEnabled: true,
      smsEnabled: false,
      emailEnabled: false,
      udid: DeviceInfo.getUniqueID(),
      label: `${DeviceInfo.getBrand()}-${DeviceInfo.getModel()}`,
      token: deviceToken,
    };

    return this.client.post('/device/link', userDeviceInfo, {
      format: 'json',
      headers: {
        token: await this.client.authStore.getAccessToken(),
      },
    });
  }
}

type UserDeviceInfo = {
  email: string;
  phone: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  udid: boolean;
  token: boolean;
  label: string;
};