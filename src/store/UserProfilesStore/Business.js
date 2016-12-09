import { observable, extendObservable } from 'mobx';

export default class Business {
  @observable currency: string;
  @observable hidden: boolean;
  @observable logo: ?string;
  @observable name: string;
  @observable products: ?string;
  @observable sector: ?string;
  @observable slug: string;
  @observable url: ?string;

  constructor(data) {
    extendObservable(this, data);
  }
}