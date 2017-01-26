import { observable, action } from 'mobx';
import { apiHelper } from 'utils';

import type Store from './index';
import type MessengerPrivateInfo from './model/MessengerPrivateInfo';
import type MessengerBusinessInfo from './model/MessengerBusinessInfo';
import type Contact from './model/Contact';

export default class CommunicationStore {
  @observable messengerInfo: MessengerPrivateInfo | MessengerBusinessInfo;
  @observable contacts: Array<Contact> = [];
  @observable isLoading: boolean;
  @observable error: string;

  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  @action
  async getUserInfo(): Promise<MessengerPrivateInfo | MessengerBusinessInfo> {
    this.isLoading = true;

    const { currentProfile } = this.store.userProfiles;

    if (!currentProfile) return null;

    const {
      getMsgrPrivateInfo,
      getMsgrBusinessInfo,
    } = this.store.api.messenger;

    const apiEndPoint = currentProfile.isBusiness
      ? getMsgrBusinessInfo.bind(null, currentProfile.id) : getMsgrPrivateInfo;

    return apiHelper(apiEndPoint, this)
      .success((resp: ApiResp) => {
        resp.data.map(data => console.log(data));
      })
      .complete(() => this.isLoading = false);
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