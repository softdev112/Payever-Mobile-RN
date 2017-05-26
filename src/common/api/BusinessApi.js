import RNFetchBlob from 'react-native-fetch-blob';
import type PayeverApi from './index';
import config from '../../config';

export default class BusinessApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  getActivities(slug: string): Promise<ActivityResp> {
    return this.client.get(`/api/rest/v1/business/${slug}/activities`);
  }

  getTodos(slug: string): Promise<ActivityResp> {
    return this.client.get(`/api/rest/v1/business/${slug}/todos`);
  }

  getBusinessInfo(slug: string): Promise<BusinessResp> {
    return this.client.get(`/api/rest/v1/business/${slug}`);
  }

  // ToDo: This API endpoint is marked as deprecated
  createNewBusiness(business: BusinessReq): Promise<CreatedBusinessResp> {
    return this.client.post('/api/rest/v1/business/create', { business });
  }

  async uploadBusinessLogo(
    media: Object,
    progressCb: (progress: number) => void
  ): Promise<ApiResp> {
    return RNFetchBlob.fetch(
      'POST',
      config.siteUrl + '/api/rest/v1/business/upload/logo',
      {
        Authorization: 'Bearer ' + await this.client.authStore.getAccessToken(),
        'Content-Type': 'octet-stream',
      },
      [
        {
          name: 'file',
          filename: media.fileName,
          data: media.data,
        },
      ]
    ).uploadProgress((written, total) => {
      if (progressCb) {
        // I add 1.97 koef for encoding to 64 bits as i understand how it works
        progressCb(1.97 * 100 * (written / total));
      }
    });
  }
}

declare class ActivityResp extends ApiResp {
  data: Array<ActivityItemData>;
}

declare class BusinessResp extends ApiResp {
  data: BusinessData;
}

declare class CreatedBusinessResp extends ApiResp {
data: CreatedBusinessData;
}

/* eslint-disable no-unused-vars */
export type ActivityItemData = {
  active: boolean;
  channel: ?string;
  description: string;
  iconImage: ?string;
  id: number;
  image: string;
  priority: number;
  title: string;
  type: string;
  url: string;
  url_label: string;
};


type BusinessReq = {
  companyName: string;
  legalForm: string;
  businessLogo: string;
  address: {
    country: string;
    zipCode: string;
    city: string;
    street: string;
    phone: string;
    extraPhone?: string;
    fax?: string;
  };
};

type CreatedBusinessData = {
  name: string;
  url: ?string;
  sector: ?string;
  products: ?string;
  currency: string;
  slug: string;
  created_at: string;
  profile: Object;
  logo: string;
};

type BusinessData = {
  owner_name: string;
  id: number;
  address: {
    id: number;
    country: string;
    country_name: string;
    city: string;
    zip_code: string;
    street: string;
    phone: string;
    extra_phone: ?string;
    fax: ?string;
    type: string;
  };
  registered: boolean;
  hidden: boolean;
  business_logo: Object;
  name: string;
  company_name: string;
  chief_title: ?string;
  chief_name: ?string;
  founding_year: ?string;
  legal_form: string;
  commercial_register_number_available: ?string;
  commercial_register_number: ?string;
  tax_id_available: ?string;
  tax_id: ?number;
  tax_number: ?number;
  small_business: boolean;
  payment_option_last_status: ?string;
  payment_option_last_update: ?string;
  staff_comment: ?string;
  commercial_register_excerpt_filename: ?string;
  use_alternative_emails: boolean;
  alternative_emails: Array<string>;
  url: ?string;
  sector: ?string;
  products: ?string;
  currency: string;
  slug: string;
  cart_software: ?string;
  bank_account: {
    id: string;
    country: ?string;
    city: ?string;
    bank_name: ?string;
    bank_code: ?string;
    swift: ?string;
    routing_number: ?string;
    account_number: ?string;
    owner: ?string;
    iban: ?string;
    bic: ?string;
  };
  created_at: string;
  updated_at: string;
  business_shipping_options: Array<any>;
  logo: string;
};