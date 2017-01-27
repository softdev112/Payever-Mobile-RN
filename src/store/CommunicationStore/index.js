import { observable, action } from 'mobx';
import { apiHelper } from 'utils';

import type Store from '../index';
import MessengerInfo from './models/MessengerInfo';
import type Contact from './models/Contact';
import type BusinessProfile from '../UserProfilesStore/models/BusinessProfile';
import { MessengerData } from '../../common/api/MessengerApi';

export default class CommunicationStore {
  @observable profiles: Object<MessengerInfo> = {};

  @observable isLoading: boolean;
  @observable error: string;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  async loadConversations(profile: BusinessProfile): MessengerInfo {
    const { api } = this.store;

    let apiPromise;
    if (profile.isBusiness) {
      apiPromise = api.messenger.getBusiness(profile.business.slug);
    } else {
      apiPromise = api.messenger.getPrivate();
    }

    return apiHelper(apiPromise, this)
      .success((data: MessengerData) => {
        const info = new MessengerInfo(data);
        this.profiles[profile.id] = info;
        return info;
      })
      .promise();
  }

  @action
  async getUserInfo(): Promise<MessengerInfo> {
    this.isLoading = true;

    const { currentProfile } = this.store.userProfiles;

    if (!currentProfile) return null;

    const {
      getPrivate,
      getBusiness,
    } = this.store.api.messenger;

    const apiEndPoint = currentProfile.isBusiness
      ? getBusiness.bind(null, currentProfile.id) : getPrivate;

    return apiHelper(apiEndPoint, this)
      .success((resp: ApiResp) => {
        resp.data.map(data => console.log(data));
      })
      .complete(() => this.isLoading = false)
      .promise();
  }

  @action
  async loadContacts(): Promise<Contact[]> {
    this.isLoading = true;

    const { api } = this.props.store;
    const userId = this.userProfiles.currentProfile.id;
    console.log(userId);

    apiHelper(api.messenger.getAvailableContacts(), this)
      .success((resp: ApiResp) => {
        if (resp.data.length > 0) {
          this.items = resp.data.map(data => console.log(data));
        } else {
          this.error = 'Sorry, we didn\'t find any results, try ' +
            'searching again';
          this.items = [];
        }
      })
      .complete(() => this.isLoading = false);
  }
}