import { action, observable } from 'mobx';
import { apiHelper } from 'utils';
import Store from '../index';
import Offer from './models/Offer';

export default class OffersStore {
  @observable error: string     = '';
  @observable isLoading: string = false;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  getOfferById(id: string) {
    const { profiles } = this.store.api;
    return apiHelper(profiles.getOfferById.bind(profiles, id), this)
      .success(offer => new Offer(offer))
      .promise();
  }
}