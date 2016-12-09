import { computed, observable } from 'mobx';

export default class Profile {
  @observable customers: number;
  @observable followers: number;
  @observable following: number;
  @observable id: number;
  @observable likes: number;
  @observable name: string;
  @observable offers: number;
  @observable sells: number;
  @observable type: string;

  @computed get isBusiness() {
    return Boolean(this.business);
  }
}