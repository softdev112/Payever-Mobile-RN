import { observable, extendObservable } from 'mobx';

export default class Business {
  @observable company_name: ?string;
  @observable currency: string;
  @observable hidden: boolean;
  @observable legal_form: ?string;
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