import type PayeverApi, { PayeverResponse } from './index';

export default class ProfilesApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  async getAccessibleList(): Promise<AccessibleListResponse | PayeverResponse> {
    const resp: AccessibleListResponse = await this.client.get(
      '/api/rest/v1/profiles/accessible-list'
    );
    const data = resp.data;

    if (!resp.ok) return resp;

    data.businesses_own   = data.businesses_own || [];
    data.businesses_staff = data.businesses_staff || [];

    return resp;
  }

  async search(query): Promise<SearchResponse | PayeverResponse> {
    return this.client.get('/api/rest/v1/profiles/search', { k: query, c: 20 });
  }

  async follow(businessId): Promise<SimpleOkResponse | PayeverResponse> {
    return this.client.post(`/api/rest/v1/profiles/${businessId}/follow`);
  }

  async unfollow(businessId): Promise<SimpleOkResponse | PayeverResponse> {
    return this.client.delete(`/api/rest/v1/profiles/${businessId}/unfollow`);
  }
}

type AccessibleListResponse = {
  data: ?{
    businesses_own: Array<BusinessProfileData>;
    businesses_staff: Array<BusinessProfileData>;
    'private': PersonalProfileData;

    error: string;
    error_description: string;
  };
  ok: boolean;
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
  };
};

type BusinessProfileData = {
  business: {
    company_name: ?string;
    currency: string;
    hidden: boolean;
    legal_form: ?string;
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

type SearchResponse = {
  data: ?Array<SearchDataRow>;
  ok: boolean;
};

type SearchDataRow = {
  id: number;
  followers: number;
  following: number;
  customers: number;
  sells: number;
  likes: number;
  offers: number;
  name: string;
  type: string;
  business: {
    name: string;
    currency: string;
    slug: string;
    logo: ?string;
  };
  is_following: boolean;
};

type SimpleOkResponse = {
  ok: boolean;
};