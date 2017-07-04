import { action, extendObservable, observable, computed } from 'mobx';
import { debounce } from 'lodash';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { cacheHelper, format, log, soundHelper } from 'utils';
import Message from './Message';
import ConversationSettingsInfo from './ConversationSettingsInfo';
import GroupSettingsInfo from './GroupSettingsInfo';
import GroupMemberInfo from './GroupMemberInfo';
import ConversationInfo from './ConversationInfo';

export default class Conversation {
  @observable archived: boolean;
  id: number;
  @observable messages: Array<Message> = [];
  name: string;
  @observable status: ConversationStatus;
  type: ConversationType = '';
  allMessagesFetched: boolean = false;
  @observable settings: ConversationSettingsInfo | GroupSettingsInfo = null;
  conversationInfo: ConversationInfo = null;

  constructor(data, conversationInfo) {
    data.messages = (data.messages || []).map(m => new Message(m));

    if (data.status) {
      data.status.typing = false;
    }

    extendObservable(this, data);

    this.updateTypingStatusLazily = this::debounce(
      this.updateTypingStatusLazily,
      6000
    );

    this.loadUndeliveredMsgs();
    this.conversationInfo = conversationInfo;
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

    this.conversationInfo.setLatestMessage(message);

    // Test if it has media and remove upload progress message with this one
    if (message.medias.length > 0) {
      const imageMessageIndex = this.messages.findIndex((m) => {
        return m.fileName === message.medias[0].name;
      });

      if (imageMessageIndex !== -1) {
        const fakeMessage = this.messages[imageMessageIndex];

        let tmpFileName = '';
        if (fakeMessage.isPicture) {
          tmpFileName = Platform.OS === 'ios'
            ? fakeMessage.uri : fakeMessage.path;
        } else {
          tmpFileName = fakeMessage.uri;
        }

        this.messages[imageMessageIndex] = message;

        // Remove copy of chosen file
        try {
          if (await RNFetchBlob.fs.exists(tmpFileName)) {
            await RNFetchBlob.fs.unlink(tmpFileName);
          }
        } catch (err) {
          log.error(err);
        }

        return;
      }
    }

    // Replace sending message stub with real message
    const sendingMessageIdx = this.messages.findIndex(
      m => m.body.trim() === format.stripHtml(message.body.trim())
        && m.isSendingMessage
    );
    if (sendingMessageIdx !== -1) {
      this.messages[sendingMessageIdx] = message;
      return;
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

  @action
  saveUndeliveredMsgs() {
    const undeliveredMsgs = this.messages.filter(m => m.isSendingMessage);
    cacheHelper.saveToCache(
      `communication:conversation:${this.id}:undelivered`, null, undeliveredMsgs
    );
  }

  @action
  async loadUndeliveredMsgs() {
    let undeliveredMsg;
    try {
      undeliveredMsg = await cacheHelper.loadFromCache(
        `communication:conversation:${this.id}:undelivered`
      );
    } catch (err) {
      log.error(err);
    }

    if (!undeliveredMsg || undeliveredMsg.length === 0) return;

    this.messages = this.messages.concat(undeliveredMsg);
  }

  @action
  async removeMessage(messageId: number) {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  @action
  async addMessage(message: Message) {
    this.messages = this.messages.concat(message);
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