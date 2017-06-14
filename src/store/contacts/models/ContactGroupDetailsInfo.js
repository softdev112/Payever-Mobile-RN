import { extendObservable } from 'mobx';
import CustomerContactInfo from './CustomerContactInfo';

export default class ContactGroupDetailsInfo {
  id: number;
  name: string;
  filters: string;
  contact_models: Array<CustomerContactInfo>;
  logo_url: string;
  total_spent: number;
  count_purchases: number;
  orders_count: number;

  constructor(data) {
    extendObservable(this, data);
  }
}