import { observable, extendObservable, computed } from 'mobx';
import { images } from 'ui';
import Profile from './Profile';
import UserAccount from './UserAccount';

export default class PersonalProfile extends Profile {
  @observable user: UserAccount;

  constructor(data, store) {
    super();
    this.store = store;
    if (data.user) {
      data.user = new UserAccount(data.user, store);
    }

    extendObservable(this, data);
  }

  @computed get logoSource() {
    if (this.user && this.user.avatar) {
      return { uri: this.user.avatar };
    }

    return images.noAvatar;
  }

  @computed get displayName() {
    return this.user.full_name;
  }

  @computed get settingsUrl() {
    const templateUrl = '/private/network/{id}/account';
    const url = this.store.config.siteUrl + templateUrl;
    return url.replace('{id}', this.user.profile_id);
  }
}