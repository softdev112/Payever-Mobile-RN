import { observable, action, computed } from 'mobx';
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

  @computed get currentMsgrProfile() {
    const { currentProfile } = this.store.userProfiles;
    if (!currentProfile) return null;

    return this.profiles[currentProfile.id] || null;
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
      .cache('communication:conversation:' + profile.id)
      .success((data: MessengerData) => {
        const info = new MessengerInfo(data);
        this.profiles[profile.id] = info;
        return info;
      })
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