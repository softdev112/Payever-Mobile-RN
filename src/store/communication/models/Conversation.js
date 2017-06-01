import { action, extendObservable, observable, computed } from 'mobx';
import { debounce } from 'lodash';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { log, soundHelper } from 'utils';
import Message from './Message';
import ConversationSettingsInfo from './ConversationSettingsInfo';
import GroupSettingsInfo from './GroupSettingsInfo';
import GroupMemberInfo from './GroupMemberInfo';

export default class Conversation {
  @observable archived: boolean;
  id: number;
  @observable messages: Array<Message> = [];
  name: string;
  @observable status: ConversationStatus;
  type: ConversationType = '';
  allMessagesFetched: boolean = false;
  @observable settings: ConversationSettingsInfo | GroupSettingsInfo = null;

  constructor(data) {
    data.messages = (data.messages || []).map(m => new Message(m));

    if (data.status) {
      data.status.typing = false;
    }

    extendObservable(this, data);

    this.updateTypingStatusLazily = this::debounce(
      this.updateTypingStatusLazily,
      6000
    );
  }

  @computed
  get isGroup() {
    return this.type && this.type.endsWith('group');
  }

  @computed
  get membersCount() {
    if (!this.isGroup) return 0;

    return this.settings ? this.settings.members.length : 0;
  }

  @computed
  get membersOnlineCount() {
    if (!this.isGroup) return 0;

    return this.settings
      ? this.settings.members.filter(m => m.status.online).length : 0;
  }

  @action
  addMember(member: GroupMemberInfo) {
    if (this.isGroup && this.settings) {
      this.settings.members.push(member);
    }
  }

  @action
  removeMember(memberId: number) {
    if (this.isGroup && this.settings) {
      const { members } = this.settings;
      this.settings.members = members.filter(m => m.id !== memberId);
    }
  }

  @action
  async updateMessage(message: Message) {
    if (!(message instanceof Message)) {
      message = new Message(message);
    }

    if (message.conversation.id !== this.id) {
      return;
    }

    const existedIdx = this.messages.findIndex(m => m.id === message.id);
    if (existedIdx !== -1) {
      this.messages[existedIdx] = message;
      return;
    }

    if (message.medias.length > 0) {
      const imageMessageIndex = this.messages.findIndex((m) => {
        return m.fileName === message.medias[0].name;
      });

      if (imageMessageIndex !== -1) {
        const fakeMessage = this.messages[imageMessageIndex];
        const copyImagePath = Platform.OS === 'ios'
          ? fakeMessage.uri : fakeMessage.path;
        this.messages[imageMessageIndex] = message;

        // Remove copy of chosen image
        try {
          if (await RNFetchBlob.fs.exists(copyImagePath)) {
            await RNFetchBlob.fs.unlink(copyImagePath);
          }
        } catch (err) {
          log.error(err);
        }

        return;
      }
    }

    this.messages.push(message);

    if (this.settings && this.settings.notification && !message.own) {
      soundHelper.playMsgReceive();
    }
  }

  @action
  updateStatus(status, typing = false) {
    if (!typing) {
      extendObservable(this.status, status);
      return;
    }

    extendObservable(this.status, {
      typing: true,
      online: true,
      lastVisit: status.lastVisit,
    });

    this.updateTypingStatusLazily();
  }

  /**
   * This method will be called only in 6s seconds. If it's called again the
   * timer is reset.
   */
  @action
  updateTypingStatusLazily() {
    this.status.typing = false;
  }

  getUnreadIds() {
    return this.messages
      .filter((message: Message) => message.unread)
      .map((message: Message) => message.id);
  }

  @action
  setReadStatus(messageId) {
    this.messages
      .filter((message: Message) => message.id === messageId)
      .forEach((message: Message) => message.opponentUnread = false);
  }

  @action
  setConversationSettings(
    settings: ConversationSettingsInfo | GroupSettingsInfo
  ) {
    extendObservable(this, { settings });
  }

  @action
  setNotificationSetting(value) {
    if (this.settings) {
      this.settings.notification = value;
    }
  }
}

export type ConversationStatus = {
  conversationId?: number;
  label: ?string;
  lastVisit: ?string;
  online: boolean;
  typing: boolean;
  userId: number;
};

export type ConversationType = 'conversation' | 'chat-group'
  | 'marketing-group';