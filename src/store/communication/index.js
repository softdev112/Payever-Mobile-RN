import {
  action, autorun, computed, extendObservable, observable, ObservableMap,
} from 'mobx';
import { apiHelper, log, soundHelper } from 'utils';
import { throttle } from 'lodash';

import UserSettings from './models/UserSettings';
import MessengerInfo from './models/MessengerInfo';
import Contact from './models/Contact';
import Conversation, { ConversationStatus }
  from './models/Conversation';
import ConversationSettingsData from './models/ConversationSettingsInfo';
import GroupSettingsData from './models/GroupSettingsInfo';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';
import Message from './models/Message';
import CommunicationUI from './ui';
import type SocketApi from '../../common/api/MessengerApi/SocketApi';
import type ConversationInfo from './models/ConversationInfo';
import type BusinessProfile from '../profiles/models/BusinessProfile';
import type GroupMemberInfo from './models/GroupMemberInfo';
import type Store from '../index';

const MSGS_REQUEST_LIMIT = 30;

export default class CommunicationStore {
  @observable conversations: ObservableMap<Conversation> = observable.map();
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean = false;
  @observable error: string = '';

  @observable selectedConversationId: number;

  @observable foundMessages: Array<Message> = [];
  @observable contactsFilter: string = '';

  @observable selectedMessages: Array<Message> = [];

  @observable contactsAutocomplete: Array = [];
  @observable contactsForAction: Array<Contact> = [];

  @observable messageForReply: Message = null;
  @observable messageForEdit: Message = null;

  @observable filesUploadingProgress: ObservableMap<number> = observable.map();

  // UI
  @observable ui: CommunicationUI = {};

  store: Store;
  socket: SocketApi;
  socketHandlers: SocketHandlers;
  socketObserver: Function;

  constructor(store: Store) {
    this.store = store;
    this.socketHandlers = new SocketHandlers(this);

    // Allow to send typingStatus only once per 5sec
    this.updateTypingStatus = this::throttle(this.updateTypingStatus, 5000);
    this.ui = new CommunicationUI();
  }

  @computed get isError() {
    return this.error !== '';
  }

  @action
  async loadMessengerInfo(profile: BusinessProfile) {
    const { api } = this.store;

    let apiPromise;
    if (profile.isBusiness) {
      apiPromise = api.messenger.getBusiness(profile.business.slug);
    } else {
      apiPromise = api.messenger.getPrivate();
    }

    return apiHelper(apiPromise, this)
      .cache('communication:messengerInfo:' + profile.id)
      .success((data: MessengerData) => {
        this.initSocket(data.wsUrl, data.messengerUser.id);
        this.messengerInfo = new MessengerInfo(data);
        this.conversations = observable.map();

        return this.messengerInfo;
      })
      .promise();
  }

  @action
  async loadConversation(id: number, limit: number = MSGS_REQUEST_LIMIT) {
    const socket = await this.store.api.messenger.getSocket();
    const userId = socket.userId;
    const type = this.messengerInfo.getConversationType(id);

    return apiHelper(socket.getConversation({ id, type, limit }), this)
      .cache(`communication:conversations:${userId}:${id}`)
      .success(async (data) => {
        const conversation = new Conversation(data);
        conversation.allMessagesFetched =
          data.messages.length < limit;

        // Load settings
        let settings = null;
        if (conversation.isGroup) {
          settings = await this.getGroupSettings(id, conversation.type);
        } else {
          settings = await this.getConversationSettings(id);
        }

        conversation.setConversationSettings(settings);
        this.conversations.merge({ [id]: observable(conversation) });

        return conversation;
      })
      .promise();
  }

  @action
  async loadOlderMessages(id: number) {
    const conversation = this.conversations.get(id);
    if (!conversation) return null;

    if (conversation.allMessagesFetched || this.isLoading) {
      return null;
    }

    const newMsgsLimit = conversation.messages.length + MSGS_REQUEST_LIMIT;
    return await this.loadConversation(id, newMsgsLimit);
  }

  @action
  async setSelectedConversationId(id) {
    this.selectedConversationId = id;
    if (id) {
      let conversation = this.conversations.get(id);
      if (!conversation) {
        //noinspection JSIgnoredPromiseFromCall
        conversation = await this.loadConversation(id);
      }

      if (conversation) {
        await this.markConversationAsRead(id);
      }
    }
  }

  @action
  async markConversationAsRead(id) {
    if (!id) return;
    const conversation: Conversation = this.conversations.get(id);
    const unreadIds = conversation.getUnreadIds();
    if (conversation) {
      conversation.messages.forEach(m => m.unread = false);
    }

    if (this.messengerInfo) {
      const info = this.messengerInfo.byId(id);
      if (info) {
        info.unreadCount = 0;
      }
    }

    if (unreadIds.length > 0) {
      const socket = await this.store.api.messenger.getSocket();
      await apiHelper(socket.updateMessagesReadStatus(unreadIds))
        .error(log.error)
        .promise();
    }
  }

  @action
  async search(text) {
    this.contactsFilter = text || '';

    if (!text) {
      this.foundMessages = [];
      return;
    }

    //noinspection JSIgnoredPromiseFromCall
    await this.searchMessages(this.contactsFilter.toLowerCase());
  }

  @action
  searchContactsAutocomplete(query) {
    const { api: { messenger } } = this.store;
    const { messengerUser } = this.messengerInfo;

    return apiHelper(
      messenger.getAvailableContacts(messengerUser.id, query),
      this
    ).success((data) => {
      this.contactsAutocomplete = data;
    }).error(log.error)
    .promise();
  }

  @action
  getContactData(contactId: number) {
    const { api: { messenger } } = this.store;
    return apiHelper(messenger.getContactData(contactId))
      .success(data => data)
      .promise();
  }

  @action
  async sendMessage(conversationId, body, channelSetId = '') {
    const socket = await this.store.api.messenger.getSocket();

    const options = {
      conversationId,
      body,
      channelSetId,
    };

    if (this.messageForReply) {
      options.replyToId = this.messageForReply.id;
      this.messageForReply = null;
    }

    const { settings } = this.selectedConversation;
    if (settings && settings.notification) {
      soundHelper.playMsgSent();
    }

    return socket.sendMessage(options);
  }

  @action
  async sendMessageWithMedias(
    body,
    mediaFileInfo,
    conversationId = this.selectedConversationId
  ) {
    const { messengerUser } = this.messengerInfo;

    const { settings } = this.selectedConversation;
    if (settings && settings.notification) {
      soundHelper.playMsgSent();
    }

    let { messages } = this.selectedConversation;
    this.isFileUploading = true;

    const uploadMessage = {
      id: String(Date.now()),
      fileName: mediaFileInfo.fileName,
      uri: mediaFileInfo.uri,
      isFileUploading: true,
      width: mediaFileInfo.width,
      height: mediaFileInfo.height,
    };

    messages = messages.concat(uploadMessage);
    this.selectedConversation.messages = messages;

    this.filesUploadingProgress.set(uploadMessage.id, 0);
    this.store.api.messenger.sendMessageWithMedias(
      messengerUser.id,
      conversationId,
      body,
      {
        data: mediaFileInfo.data,
        fileName: mediaFileInfo.fileName,
        uploadProgressKey: uploadMessage.id,
      },
      this.updateFileUploadProgress.bind(this)
    ).catch(log.error);
  }

  @action
  updateFileUploadProgress(progressId: string, value: number) {
    const key = progressId;
    if (this.filesUploadingProgress.has(key)) {
      if (value >= 100) {
        this.filesUploadingProgress.set(key, 100);
      } else {
        this.filesUploadingProgress.set(key, value);
      }
    }
  }

  @action
  removeFileUploadingProgress(progressId: string) {
    this.filesUploadingProgress.delete(progressId);
  }

  @action
  async searchMessages(query) {
    const socket = await this.store.api.messenger.getSocket();
    return apiHelper(socket.searchMessages(query))
      .success((data) => {
        const messages = data.messages || [];
        this.foundMessages = messages.map(m => new Message(m));
        return this.foundMessages;
      })
      .promise();
  }

  @action
  clearFoundMessages() {
    this.foundMessages = [];
  }

  @action
  setMessageForReply(message: Message) {
    // Clear all selections
    this.removeMessageForEdit();
    this.clearSelectedMessages();
    this.ui.setSelectMode(false);
    this.ui.setForwardMode(false);

    this.messageForReply = message;
  }

  @action
  removeMessageForReply() {
    this.messageForReply = null;
  }

  @action
  setMessageForEdit(message: Message) {
    this.messageForEdit = message;
  }

  @action
  removeMessageForEdit() {
    this.messageForEdit = null;
  }

  @action
  async saveUserSettings(settings: UserSettings) {
    const { api: { messenger } } = this.store;
    const { messengerUser } = this.messengerInfo;

    apiHelper(messenger.saveSettings(messengerUser.id, settings))
      .success(() => {
        const userSettings = new UserSettings(settings);
        soundHelper.setUserSettings(userSettings);

        extendObservable(this.messengerInfo, { userSettings });
      })
      .error(log.error);
  }

  @action
  async updateTypingStatus(conversationId) {
    const socket = await this.store.api.messenger.getSocket();
    return await socket.updateTypingStatus(conversationId);
  }

  @computed
  get contactsAndGroupsData() {
    const filter = this.contactsFilter;
    const info = this.messengerInfo;

    let contacts = info ? info.conversations.slice() : [];
    let groups   = info ? info.groups.slice() : [];
    const foundMessages = this.foundMessages.slice();

    if (filter) {
      contacts = contacts.filter(c => c.name.toLowerCase().includes(filter));
      groups = groups.filter(c => c.name.toLowerCase().includes(filter));
    }

    return [{
      data: contacts,
      title: 'contacts',
      key: '1',
    }, {
      data: groups,
      title: 'groups',
      key: '2',
    }, {
      data: foundMessages,
      title: 'foundMessages',
      key: '3',
    }];
  }

  @computed
  get selectedConversation(): Conversation {
    return this.conversations.get(this.selectedConversationId);
  }

  @computed get isContactsForActionAvailable() {
    return this.contactsForAction.length > 0;
  }

  @action
  updateUserStatus(status: ConversationStatus, typing = false) {
    this.conversations.forEach((conversation: Conversation) => {
      if (!conversation || !conversation.status) return;
      if (conversation.status.userId !== status.userId) return;

      conversation.updateStatus(status, typing);
    });

    this.messengerInfo.conversations.forEach((info: ConversationInfo) => {
      if (info.status.userId !== status.userId) return;
      info.updateStatus(status);
    });
  }

  @action
  updateMessage(message: Message) {
    const conversationId = message.conversation.id;

    // Update a conversation if it's opened
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.updateMessage(message);
    }

    const info = this.messengerInfo.byId(conversationId);

    // Reload messengerInfo if it's new conversation
    if (!info) {
      //noinspection JSIgnoredPromiseFromCall
      this.loadMessengerInfo(this.store.profiles.currentProfile);
      return;
    }

    if (message.unread) {
      info.unreadCount = +info.unreadCount + 1;
      log.info('Increase count', info);
    }
  }

  @action
  async forwardMessage(forwardFromId) {
    const socket = await this.store.api.messenger.getSocket();
    return socket.sendMessage({
      forwardFromId,
      conversationId: this.selectedConversationId,
    });
  }

  @action
  forwardSelectedMessages() {
    this.selectedMessages.forEach(async (m) => {
      await this.forwardMessage(m.id);
    });

    this.clearSelectedMessages();
  }

  @action
  async deleteMessage(messageId) {
    const socket = await this.store.api.messenger.getSocket();
    return socket.deleteMessage(messageId);
  }

  @action
  deleteSelectedMessages() {
    this.selectedMessages.forEach(async (m) => {
      if (!m.deleted && m.deletable) {
        await this.deleteMessage(m.id);
      }
    });

    this.clearSelectedMessages();
  }

  @action
  deleteAllMsgsInSelectConversation() {
    this.clearSelectedMessages();

    this.selectedConversation.messages.forEach(async (m) => {
      if (!m.deleted && m.deletable) {
        await this.deleteMessage(m.id);
      }
    });
  }

  @action
  async editMessage(id, newValue) {
    const socket = await this.store.api.messenger.getSocket();

    return socket.editMessage({ id, newValue });
  }

  @action
  selectMessage(message: Message) {
    if (this.checkMessageSelected(message.id)) return;

    extendObservable(this, {
      selectedMessages: this.selectedMessages.concat(message),
    });
  }

  @action
  deselectMessage(messageId: number) {
    extendObservable(this, {
      selectedMessages: this.selectedMessages.filter(m => m.id !== messageId),
    });
  }

  @action
  clearSelectedMessages() {
    extendObservable(this, {
      selectedMessages: [],
    });
  }

  @action
  checkMessageSelected(messageId: number) {
    return !!this.selectedMessages.find(m => m.id === messageId);
  }

  @action
  addContactForAction(contact: Contact) {
    if (this.checkContactAddedForAction(contact.id)) return;

    this.contactsForAction.push(contact);
  }

  @action
  removeContactForAction(contactId: string) {
    this.contactsForAction =
      this.contactsForAction.filter(contact => contact.id !== contactId);
  }

  @action
  checkContactAddedForAction(contactId: number) {
    // savedId - it's id which might be manually added when converting
    // saved contact to general contact (getContactData - gets general data
    // for contact by savedContact Id
    return !!this.contactsForAction.find(
      contact => contact.id === contactId || contact.savedId === contactId
    );
  }

  @action
  clearContactsForAction() {
    this.contactsForAction = [];
  }

  @action
  clearAtocomleteContactsSearch() {
    this.contactsAutocomplete = [];
  }

  @action
  createNewGroup(groupName: string, isAllowGroupChat: boolean) {
    const { api: { messenger } } = this.store;
    const { messengerUser } = this.messengerInfo;

    const recipients = this.contactsForAction.slice()
      .reduce((result, contact, index, contacts) => {
        return result + contact.id +
          (contacts.length - 1 !== index ? ',' : '');
      }, '');

    apiHelper(messenger.createNewGroup(
       messengerUser.id,
       groupName,
       recipients,
       isAllowGroupChat
    )).success();
  }

  @action
  async getConversationSettings(id) {
    const socket = await this.store.api.messenger.getSocket();

    return apiHelper(socket.getConversationSettings(id), this)
      .success(data => new ConversationSettingsData(data))
      .promise();
  }

  @action
  async changeConvNotificationProp(state) {
    const socket = await this.store.api.messenger.getSocket();

    apiHelper(socket.changeConvNotificationProp(
      this.selectedConversationId, state
    )).success();

    this.selectedConversation.setNotificationSetting(state);
    const convInfo = this.messengerInfo.byId(this.selectedConversationId);
    if (convInfo) {
      convInfo.notification = state;
    }
  }

  @action
  async getChatGroupSettings(groupId: number) {
    const socket = await this.store.api.messenger.getSocket();
    return apiHelper(socket.getChatGroupSettings(groupId), this)
      .success(data => data)
      .promise();
  }

  @action
  async getMarketingGroupSettings(groupId: number) {
    const socket = await this.store.api.messenger.getSocket();
    return apiHelper(socket.getMarketingGroupSettings(groupId), this)
      .success(data => data)
      .promise();
  }

  @action
  async getGroupSettings(groupId, type: 'chat-group' | 'marketing-group') {
    let currentGroupSettings = null;
    if (type === 'chat-group') {
      currentGroupSettings = await this.getChatGroupSettings(groupId);
    } else if (type === 'marketing-group') {
      currentGroupSettings = await this.getMarketingGroupSettings(groupId);
    }

    return new GroupSettingsData(currentGroupSettings);
  }

  @action
  async removeGroupMember(groupId: number, memberId: number) {
    const socket = await this.store.api.messenger.getSocket();

    apiHelper(socket.removeGroupMember(groupId, memberId))
      .success(() => {
        this.selectedConversation.removeMember(memberId);
        this.markConversationAsRead(this.selectedConversationId);
      })
      .error(log.error);
  }

  @action
  async addGroupMember(groupId: number, memberAlias: string) {
    const socket = await this.store.api.messenger.getSocket();
    return apiHelper(socket.addGroupMember(groupId, memberAlias))
      .success((data) => {
        this.selectedConversation.addMember(data);

        // Mark conversation as read to avoid badge appearance
        this.markConversationAsRead(this.selectedConversationId);
      })
      .promise();
  }

  @action
  addAllMembersToGroup(groupId: number) {
    const contacts = this.store.contacts.selectedContacts.slice().map((m) => {
      m.id = `contact-${m.id}`;
      return m;
    });

    const members = contacts.concat(this.contactsForAction.slice());
    members.forEach(async (member: GroupMemberInfo) => {
      await this.addGroupMember(groupId, member.id);
    });
  }

  @action
  async deleteGroup(groupId: number) {
    const socket = await this.store.api.messenger.getSocket();
    apiHelper(socket.deleteGroup(groupId))
      .success(() => {
        // Remove group locally
        const { groups } = this.messengerInfo;
        const delGroupIndex = groups.findIndex(group => group.id === groupId);

        let newIndex = -1;
        if (groups.length > 1) {
          newIndex = delGroupIndex > 0 ? delGroupIndex - 1 : delGroupIndex + 1;
        }

        if (newIndex !== -1) {
          this.setSelectedConversationId(groups[newIndex].id);
        } else {
          this.setSelectedConversationId(null);
        }

        this.messengerInfo.groups = groups.filter(
          group => group.id !== groupId
        );
      })
      .error(log.error);
  }

  @action
  sendInviteMsgToContacts(message: string) {
    const userContacts = this.store.contacts.selectedContacts.slice()
      .map((m) => {
        m.id = `contact-${m.id}`;
        return m;
      });

    const recipients = userContacts.concat(this.contactsForAction.slice())
      .reduce((result, contact, index, contacts) => {
        return result + contact.id +
          (contacts.length - 1 !== index ? ',' : '');
      }, '');

    const { api } = this.store;
    const { messengerUser } = this.messengerInfo;

    apiHelper(api.messenger.sendMessage(
      messengerUser.id,
      recipients,
      message
    )).success(() => {
      this.clearAtocomleteContactsSearch();
      this.store.contacts.clearSelectedContacts();
    });
  }

  @action
  sendMsgToMarketingGroup(groupRecipientId, message: string) {
    const { api } = this.store;
    const { messengerUser } = this.messengerInfo;

    apiHelper(api.messenger.sendMessage(
      messengerUser.id,
      groupRecipientId,
      message
    )).success();
  }

  initSocket(url, userId) {
    const { api, auth } = this.store;

    if (this.socket && this.socket.userId === userId) {
      return;
    }

    this.socket = api.messenger.connectToWebSocket(
      url,
      userId,
      auth.getAccessToken()
    );

    this.socketHandlers.subscribe(this.socket);

    if (this.socketObserver) {
      this.socketObserver();
    }
    this.socketObserver = autorun(() => {
      this.socket.setAccessToken(auth.getAccessToken());
    });
  }
}