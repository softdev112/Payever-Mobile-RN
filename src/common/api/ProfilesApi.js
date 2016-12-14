import type PayeverApi from './index';

export default class ProfilesApi {
  constructor(client: PayeverApi) {
    this.client = client;
  }

  async getAccessibleList(): Promise<AccessibleListResponse> {
    const resp: AccessibleListResponse = await this.client.get(
      '/api/rest/v1/profiles/accessible-list'
    );
    const data = resp.data;

    if (!resp.ok) return resp;

    data.businesses_own   = data.businesses_own || [];
    data.businesses_staff = data.businesses_staff || [];

    return resp;
  }
}

type AccessibleListResponse = {
  data: ?{
    businesses_own: Array<BusinessProfileData>;
    businesses_staff: Array<BusinessProfileData>;
    'private': PersonalProfileData;

    error: string;
    error_description: string;
  },
  ok: boolean
};

type PersonalProfileData = {
  customers: number;
  followers: number;
  following: number;
  id: number;
  likes: number;
  name: string;
  offers: number;
  sells: number;
  type: string;
  user: {
    avatar: string;
    birthday: ?string;
    confirmation_token: ?string;
    created_at: string;
    default_language: ?string;
    email: string;
    enabled: boolean;
    first_name: string;
    full_name: string;
    last_name: string;
    marketing_source: ?string;
    profile_id: string;
    registration_completed: boolean;
    registration_source: string;
    roles: Array<string>;
    updated_at: string;
  }
};

type BusinessProfileData = {
  business: {
    companyName: ?string;
    currency: string;
    hidden: boolean;
    legalForm: ?string;
    logo: ?string;
    name: string;
    products: ?string;
    sector: ?string;
    slug: string;
    url: ?string;
  };
  customers: number;
  followers: number;
  following: number;
  id: number;
  likes: number;
  name: string;
  offers: number;
  sells: number;
  stores: number;
  type: string;
};