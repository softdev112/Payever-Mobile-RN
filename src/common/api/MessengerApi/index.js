import { pickBy } from 'lodash';
import type PayeverApi from '../index';
import SocketApi from './SocketApi';
import WampClient from './WampClient';

export default class MessengerApi {
  client: PayeverApi;
  socket: SocketApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  getBusiness(slug: string): Promise<MessengerDataResp> {
    return this.client.get(`/api/rest/v1/messenger/business/${slug}`);
  }

  getPrivate(): Promise<MessengerDataResp> {
    return this.client.get('/api/rest/v1/messenger/private');
  }

  connectToWebSocket(wsUrl, userId, accessToken): SocketApi {
    if (this.socket) {
      this.socket.close();
    }

    const enableLog = this.client.config.debug.logWampCall;

    const client = new WampClient(wsUrl, accessToken, enableLog);
    this.socket = new SocketApi(client, userId);
    return this.socket;
  }

  /**
   * Return a SocketApi instance only when it's connected
   */
  async getSocket(): Promise<SocketApi> {
    if (!this.socket) {
      throw new Error('WAMP socket isn\'t initialized');
    }
    return this.socket.resolveWhenConnected();
  }

  updateFlagForConversation(
    userId: number,
    conversationId: number,
    state: boolean
  ): Promise<ApiResp> {
    return this.client.post('/api/rest/v1/messenger/archive/conversation', {
      format: 'json',
      data: {
        userId,
        conversationId,
        state,
      },
    });
  }

  getUsersDataForGroup(id): Promise<AllContactsResp> {
    return this.client.get(`/api/rest/v1/messenger/contact-group/${id}`);
  }

  async getAvailableContacts(
    messengerId: number,
    query: string,
    limit: number = 50
  ): Promise<AllContactsResp> {
    return this.client.get('/api/rest/v1/messenger/contacts/autocomplete', {
      query,
      limit,
      id: messengerId,
    });
  }

  async getContactData(id): Promise<ContactMessengerDataResp> {
    return this.client.get(`/api/rest/v1/messenger/contacts/${id}`);
  }

  parseEmailMessage(toUser: string, data: string): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/new/email-response/', {
      format: 'json',
      data: {
        data,
        to: toUser,
      },
    });
  }

  createNewGroup(
    userId: number,
    name: string,
    recipients: string,
    chatType: boolean
  ): Promise<GroupResp> {
    return this.client.post('/api/rest/v1/messenger/new/group', {
      userId,
      new_group: {
        name,
        recipients,
        chatType,
      },
    }, {
      format: 'formData',
    });
  }

  sendMessage(
    userId: number,
    recipients: string,
    message: string
  ): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/new/message', {
      userId,
      new_message: {
        recipients,
        body: message,
      },
    }, {
      format: 'formData',
    });
  }

  sendMessageWithMedias(
    userId: number,
    conversationId: number,
    recipients: string,
    message: string,
    media: Array<any>
  ): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/new/message', {
      format: 'formData',
      data: {
        userId,
        conversationId,
        new_message: {
          media,
          recipients,
          body: message,
        },
      },
    });
  }

  sendInviteMessageFromSupport(
    userId: number,
    messengerId: number
  ): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/send/invitation-message', {
      format: 'json',
      data: {
        userId,
        messengerId,
      },
    });
  }

  sendVoiceMessage(userId: number, file: string): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/send/voice-message', {
      format: 'json',
      data: {
        userId,
        file,
      },
    });
  }

  async saveSettings(
    userId: number,
    settings: UserSettingsData
  ): Promise<UserSettingsResp> {
    // Remove all boolean settings to switch it off
    // that's how backend works
    const data = pickBy(settings, val => val !== false);
    delete data.id;

    return await this.client.post('/api/rest/v1/messenger/user/settings', {
      userId,
      user_settings: data,
    });
  }
}

declare class MessengerDataResp extends ApiResp {
  data: MessengerData;
}

declare class AllContactsResp extends ApiResp {
  data: Array<ContactData>;
}

/* eslint-disable no-unused-vars */
declare class ContactResp extends ApiResp {
  data: ContactData;
}

declare class ContactMessengerDataResp extends ApiResp {
  data: ContactMessengerData;
}

declare class MessageResp extends ApiResp {
  data: MessageData;
}

declare class GroupResp extends ApiResp {
  data: GroupData;
}

declare class UserSettingsResp extends ApiResp {
  data: UserSettingsData;
}

export type MessengerData = {
  conversations: Array<ConversationData>;
  groups: Array<GroupData>;
  marketingGroups?: Array<GroupData>;
  messengerUser: {
    avatar: AvatarData;
    id: number;
    name: string;
    user_type: 'business' | 'user';
  };
  userSettings: UserSettingsData;
  wsUrl: string;
};

type AvatarData = {
  type: string;
  value: string;
  valueRetina?: string;
};

type UserSettingsData = {
  id: number;
  notificationDesktop: boolean;
  notificationPreview: boolean;
  notificationSound: boolean;
  notificationVolume: number;
  silentPeriodStart: {
    hour: number;
    minute: number;
  };
  silentPeriodState: boolean;
  silentPeriodStop: {
    hour: number;
    minute: number;
  };
};

type ConversationData = {
  archived: boolean;
  avatar: AvatarData;
  hasUnread: boolean;
  id: number;
  isBot: boolean;
  latestMessage: MessageData;
  name: string;
  notification: boolean;
  recipient_id: string;
  status: {
    label: string;
    lastVisit: string;
    online: boolean;
    userId: number;
  };
  type: string;
  unreadCount: number;
};

type MessageData = {
  avatar: AvatarData;
  body: string;
  conversation: {
    id: number;
    name: string;
    type: string;
    archived: boolean;
    notification: boolean;
  };
  date: string;
  dateFormated: string;
  dateOnly: string;
  deletable: boolean;
  deleted: boolean;
  editable: boolean;
  editBody: string;
  edited: boolean;
  forwardFrom: ?Object;
  id: number;
  isSystem: boolean;
  medias: Array<any>;
  offer: ?Object;
  offerId: ?number;
  opponentUnread: boolean;
  own: boolean;
  recipient: string;
  replyTo: ?Object;
  senderId: number;
  senderName: string;
  unread: boolean;
};

/* eslint-disable no-unused-vars */
type ContactData = {
  avatar: AvatarData;
  blockName: string;
  email: string;
  id: string;
  name: string;
};

type ContactMessengerData = {
  contactId: number;
  avatar: AvatarData;
  messengerUser: {
    id: number;
    name: string;
    user_type: string;
  };
};

type GroupData = {
  addDate: string;
  addDateFormated: string;
  avatar: AvatarData;
  hasUnread: boolean;
  id: number;
  latestMessage: ?MessageData;
  name: string;
  participantsCount: string;
  recipient_id: string;
  type: string;
  unreadCount: number;
};