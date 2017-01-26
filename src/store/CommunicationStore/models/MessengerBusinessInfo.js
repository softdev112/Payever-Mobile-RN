import { observable } from 'mobx';
import MessengerPrivateInfo from './MessengerPrivateInfo';

import type Group from './Group';

export default class MessengerBusinessInfo extends MessengerPrivateInfo {
  @observable marketingGroups: Array<Group>;
}