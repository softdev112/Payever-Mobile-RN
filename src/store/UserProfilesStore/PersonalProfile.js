import { observable, extendObservable } from 'mobx';
import Profile from './Profile';
import UserAccount from './UserAccount';

export default class PersonalProfile extends Profile {
  @observable user: UserAccount;

  constructor(data) {
    super();
    if (data.user) {
      data.user = new UserAccount(data.user);
    }
    extendObservable(this, data);
  }
}