/**
 * Created by Elf on 25.01.2017.
 */
import { observable } from 'mobx';

import type Conversation from './Conversation';
import type UserSettings from './UserSettings';
import type Group from './Group';

export default class MessengerPrivateInfo {
  @observable id: number;
  @observable name: string;
  @observable avatar: UserAvatar;
  @observable userType: string;
  @observable userSettings: UserSettings;
  @observable conversations: Array<Conversation>;
  @observable groups: Array<Group>;
}

export type UserAvatar = {
  type: string;
  value: string;
};