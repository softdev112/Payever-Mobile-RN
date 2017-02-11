import DeviceInfo from 'react-native-device-info';

import type PayeverApi from './index';
import type UserAccount from '../../store/UserProfilesStore/models/UserAccount';

export default class DeviceApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  linkDeviceToken(
    userProfile: UserAccount,
    deviceToken: string
  ): Promise<ApiResp> {
    const userDeviceInfo: UserDeviceInfo = {
      email: userProfile.email,
      phone: '+79103330727',
      pushEnabled: true,
      smsEnabled: false,
      emailEnabled: false,
      udid: DeviceInfo.getUniqueID(),
      label: `${DeviceInfo.getBrand()}-${DeviceInfo.getModel()}`,
      token: deviceToken,
    };

    console.log('ssssssssssssssss');
    console.log(userDeviceInfo);

    return this.client.post('/device/link', userDeviceInfo, {
      format: 'json',
      addTokenToHeaders: true,
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