import AuthStore from './AuthStore';
import UserProfilesStore from './UserProfilesStore';

//import PayeverApi from '../common/api';

export default class Store {
  auth: AuthStore;
  userProfiles: UserProfilesStore;

  //api: PayeverApi;

  constructor(config) {
    this.auth = new AuthStore(this);
    //this.userProfiles = new UserProfilesStore(this);

    // Initialize some helper classes
    //this.api = new PayeverApi(config.api);
  }
}