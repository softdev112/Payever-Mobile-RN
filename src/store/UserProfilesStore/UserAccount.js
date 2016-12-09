import { observable, extendObservable } from 'mobx';

export default class UserAccount {
  @observable avatar: string;
  @observable birthday: ?string;
  @observable confirmation_token: ?string;
  @observable created_at: string;
  @observable default_language: ?string;
  @observable email: string;
  @observable enabled: boolean;
  @observable first_name: string;
  @observable full_name: string;
  @observable last_name: string;
  @observable marketing_source: ?string;
  @observable profile_id: string;
  @observable registration_completed: boolean;
  @observable registration_source: string;
  @observable roles: Array<string>;
  @observable updated_at: string;

  constructor(data) {
    extendObservable(this, data);
  }
}