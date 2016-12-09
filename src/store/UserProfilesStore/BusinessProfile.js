import { observable, extendObservable } from 'mobx';
import Profile from './Profile';
import Business from './Business';

export default class BusinessProfile extends Profile {
  @observable business: Business;

  constructor(data) {
    super();
    if (data.business) {
      data.business = new Business(data.business);
    }
    extendObservable(this, data);
  }
}