import { log } from 'utils';

export default class Offer {
  created_at: string;
  description: string;
  id: number;
  marketing_channel_set: {
    id: number;
    name: string;
    slug: string;
    store: {
      business: {
        logo: string;
        name: string;
        slug: string;
      };
      id: number;
      items: Array<OfferItem>;
    };
  };
  since: number;
  status: 'DRAFT' | 'SENT';
  title: string;
  visibility: 'ALL' | 'FOLLOWERS' | 'JUST-ME';

  constructor(data) {
    try {
      const store = data.marketing_channel_set.store;
      if (store.items && store.items.length > 0) {
        store.items = store.items.map(it => new OfferItem(it));
      }
    } catch (e) {
      log.warn('Couldn\'t construct Offer.marketing_channel_set.store.items');
    }
    Object.assign(this, data);
  }
}

export class OfferItem {
  description: string;
  id: number;
  media: Array<OfferMedia>;
  name: string;
  origin_image: string;
  positions: Array<OfferPosition>;
  thumbnail: string;

  constructor(data) {
    data.media = (data.media || []).map(m => new OfferMedia(m));
    data.positions = (data.positions || []).map(m => new OfferPosition(m));
    Object.assign(this, data);
  }
}

export class OfferMedia {
  id: number;
  is_video: boolean;
  thumbnail: string;

  constructor(data) {
    Object.assign(this, data);
  }
}

export class OfferPosition {
  id: number;
  name: string;
  price: string;

  constructor(data) {
    Object.assign(this, data);
  }
}