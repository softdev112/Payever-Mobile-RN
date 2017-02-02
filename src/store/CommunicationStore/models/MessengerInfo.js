import { computed, extendObservable, observable } from 'mobx';

import ConversationInfo from './ConversationInfo';
import UserSettings from './UserSettings';
import Group from './Group';
import type { MessengerData } from '../../../common/api/MessengerApi';
import Avatar from './Avatar';

export default class MessengerInfo {
  @observable conversations: Array<ConversationInfo> = [];
  @observable groups: Array<Group>                   = [];
  @observable marketingGroups: Array<Group>          = [];
  @observable messengerUser: {
    avatar: Avatar;
    id: number;
    name: string;
    user_type: 'business' | 'user';
  };
  @observable userSettings: UserSettings;
  @observable wsUrl: string;

  constructor(data: MessengerData) {
    data.conversations = (data.conversations || [])
      .map(c => new ConversationInfo(c));

    this.groups = (data.groups || [])
      .map(g => new Group(g));

    data.marketingGroups = data.marketingGroups || [];

    data.messengerUser = data.messengerUser || {};
    data.messengerUser.avatar = new Avatar(data.messengerUser.avatar);

    data.userSettings = new UserSettings(data.userSettings);

    extendObservable(this, data);
  }

  @computed get isBusiness() {
    return this.messengerUser.user_type === 'business';
  }
}