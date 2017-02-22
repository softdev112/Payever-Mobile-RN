import type PayeverApi from './index';

export default class ProfilesApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  async getAccessibleList(): Promise<ProfileResp> {
    const resp: ProfileResp = await this.client.get(
      '/api/rest/v1/profiles/accessible-list'
    );
    const data              = resp.data;

    if (!resp.ok) return resp;

    data.businesses_own   = data.businesses_own || [];
    data.businesses_staff = data.businesses_staff || [];

    return resp;
  }

  async getOfferById(id): Promise<OfferResp> {
    return this.client.get(`/api/rest/v1/profiles/offer/${id}`);
  }

  async search(query): Promise<SearchResp> {
    return this.client.get('/api/rest/v1/profiles/search', { k: query, c: 20 });
  }

  async follow(businessId): Promise<ApiResp> {
    return this.client.post(`/api/rest/v1/profiles/${businessId}/follow`);
  }

  async unfollow(businessId): Promise<ApiResp> {
    return this.client.delete(`/api/rest/v1/profiles/${businessId}/unfollow`);
  }
}

declare class ProfileResp extends ApiResp {
  data: ProfilesData;
}

/* eslint-disable */
declare class OfferResp extends ApiResp {
  since: number;
  id: number;
  status: 'DRAFT' | 'SENT';
  type: 'EMAIL';
  visibility: 'ALL';
  marketing_channel_set: {
    id: number;
    name: string;
    slug: string;
    store: {
      id: number;
      business: {
        name: string;
        slug: string;
        logo: string;
      };
      items: [
        {
          id: number;
          item_type: 'physical';
          name: string;
          description: string;
          positions: [
            {
              id: number;
              name: string;
              description: ?string;
              price: number;
              quantity: number;
              barcode: ?string;
            }
          ];
          media: [
            {
              id: number;
              thumbnail: string;
              is_video: boolean;
            }
          ];
          like_profiles: Array<any>;
          item_shipping_type: 'general';
          fixed_shipping_price: ?number;
          weight: ?number;
          vat: string;
          origin_image: string;
          thumbnail: string;
          thumbnailList: string;
          thumbnailGrid: string;
          market_url: string;
        }
      ];
      logo_url: ?string;
    };
  };
  title: string;
  description: string;
  created_at: string;
};
/* eslint-enable */

export type ProfilesData = {
  businesses_own: Array<BusinessProfileData>;
  businesses_staff: Array<BusinessProfileData>;
  'private': PersonalProfileData;
};

/* eslint-disable no-unused-vars */
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

/* eslint-disable no-unused-vars */
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

declare class SearchResp extends ApiResp {
  data: ?Array<SearchDataRow>;
}

/* eslint-disable no-unused-vars */
export type SearchDataRow = {
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