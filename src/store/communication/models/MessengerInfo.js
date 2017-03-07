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

    data.groups = (data.groups || [])
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

  @computed
  get unreadCount() {
    return this.conversations.reduce((res, c) => res + +c.unreadCount, 0);
  }

  @computed
  get unreadGroupCount() {
    return this.groups.reduce((res, c) => res + +c.unreadCount, 0);
  }

  getDefaultConversation(): ConversationInfo | Group {
    if (this.conversations[0]) {
      return this.conversations[0];
    }

    if (this.groups[0]) {
      return this.groups[0];
    }

    return null;
  }

  find(callback): ConversationInfo {
    return this.conversations.find(callback)
      || this.groups.find(callback)
      || this.marketingGroups.find(callback);
  }

  byId(conversationId): ConversationInfo {
    return this.find(c => c.id === conversationId);
  }

  getConversationType(conversationId) {
    const conversation = this.byId(conversationId);
    return conversation ? conversation.type : null;
  }
}