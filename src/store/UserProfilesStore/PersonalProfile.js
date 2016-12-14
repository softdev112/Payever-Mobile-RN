import { observable, extendObservable, computed } from 'mobx';
import Profile from './Profile';
import UserAccount from './UserAccount';

import imgNoAvatar from './images/no-avatar.png';

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
    } else {
      return imgNoAvatar;
    }
  }

  @computed get displayName() {
    return this.user.full_name;
  }
}