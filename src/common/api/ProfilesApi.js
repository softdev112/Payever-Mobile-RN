import type PayeverApi from './index';

export default class ProfilesApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  getAccessibleList(): Promise<AccessibleListResponse> {
    return this.client.get('/api/rest/v1/profiles/accessible-list');
  }
}

type AccessibleListResponse = {
  data: ?{
    businesses_own: Array<BusinessProfile>,
    businesses_staff: Array<BusinessProfile>,
    'private': PersonalProfile
  },
  ok: boolean
};

