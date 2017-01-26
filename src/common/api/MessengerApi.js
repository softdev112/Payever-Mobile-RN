import type PayeverApi from './index';

export default class MessengerApi {
  client: PayeverApi;

  constructor(client: PayeverApi) {
    this.client = client;
  }

  getMsgrBusinessInfo(slug: string): Promise<MsgrBusinessInfoResp> {
    return this.client.get(`/api/rest/v1/messenger/business/${slug}`);
  }

  getMsgrPrivateInfo(): Promise<MsgrPrivateInfoResp> {
    return this.client.get('/api/rest/v1/messenger/private');
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

  getAvailableContacts(
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

  getContactData(id): Promise<ContactResp> {
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
    chatType: string
  ): Promise<GroupResp> {
    return this.client.post('/api/rest/v1/messenger/new/group', {
      format: 'formData',
      data: {
        userId,
        new_group: {
          name,
          recipients,
          chatType,
        },
      },
    });
  }

  sendSimpleMessage(
    userId: number,
    recipients: string,
    message: string
  ): Promise<MessageResp> {
    return this.client.post('/api/rest/v1/messenger/new/message', {
      format: 'formData',
      data: {
        userId,
        new_message: {
          recipients,
          body: message,
        },
      },
    });
  }

  async sendMessageWithMedias(
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

  async sendInvitationMessage(
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

  async sendVoiceMessage(userId: number, file: string): Promise<MessageResp> {
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
    settings: UserSettings
  ): Promise<UserSettingsResp> {
    return this.client.post('/api/rest/v1/messenger/user/setting', {
      format: 'formData',
      data: {
        userId,
        user_settings: settings,
      },
    });
  }
}

declare class MsgrPrivateInfoResp extends ApiResp {
  data: MessengerPrivateInfo;
}

declare class MsgrBusinessInfoResp extends ApiResp {
  data: MessengerBusinessInfo;
}

declare class AllContactsResp extends ApiResp {
  data: Array<Contact>;
}

declare class ContactResp extends ApiResp {
  data: Contact;
}

declare class MessageResp extends ApiResp {
  data: Message;
}

declare class GroupResp extends ApiResp {
  data: Group;
}

declare class UserSettingsResp extends ApiResp {
  data: UserSettings;
}

/* eslint-disable no-unused-vars */
type MessengerPrivateInfo = {
  wsUrl: string;
  messengerUser: MessengerUser;
  userSettings: UserSettings;
  conversations: Array<Conversation>;
  groups: Array<Group>;
};

type MessengerBusinessInfo = {
  wsUrl: string;
  messengerUser: MessengerUser;
  userSettings: UserSettings;
  conversations: Array<Conversation>;
  marketingGroups: Array<Group>;
  groups: Array<Group>;
};

type MessengerUser = {
  id: number;
  name: string;
  avatar: UserAvatar;
  user_type: string;
};

type UserAvatar = {
  type: string;
  value: string;
};

type UserSettings = {
  id: number;
  notificationDesktop: boolean;
  notificationPreview: boolean;
  notificationSound: boolean;
  notificationVolume: number;
  silentPeriodState: boolean;
  silentPeriodStart: {
    hour: number;
    minute: number;
  };
  silentPeriodStop: {
    hour: number;
    minute: number;
  };
};

type Conversation = {
  id: number;
  name: string;
  type: string;
  recipient_id: string;
  status: ConversationStatus;
  hasUnread: boolean;
  unreadCount: number;
  archived: boolean;
  notification: boolean;
  isBot: boolean;
  avatar: UserAvatar;
  latestMessage: Message;
};

type ConversationStatus = {
  online: boolean;
  lastVisit: string;
  label: string;
  userId: number;
};

type Message = {
  id: number;
  body: string;
  editBody: string;
  offerId: ?number;
  offer: ?Object;
  senderId: number;
  senderName: string;
  date: string;
  dateOnly: string;
  dateFormated: string;
  avatar: UserAvatar;
  own: boolean;
  isSystem: boolean;
  replyTo: ?Object;
  forwardFrom: ?Object;
  edited: boolean;
  deleted: boolean;
  editable: boolean;
  deletable: boolean;
  conversation: {
    id: number;
    name: string;
    type: string;
    archived: boolean;
    notification: boolean;
  };
  recipient: string;
  unread: boolean;
  opponentUnread: boolean;
  medias: Array<any>;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  avatar: UserAvatar;
  blockName: string;
};

type Group = {
  id: number;
  name: string;
  type: string;
  recipient_id: string;
  hasUnread: boolean;
  unreadCount: number;
  avatar: UserAvatar;
  participantsCount: string;
  addDate: string;
  addDateFormated: string;
  latestMessage: ?Message;
};