import {
  action, autorun, computed, extendObservable, observable, ObservableMap,
} from 'mobx';
import { apiHelper, log } from 'utils';
import { DataSource } from 'ui';
import { throttle } from 'lodash';

import UserSettings from './models/UserSettings';
import MessengerInfo from './models/MessengerInfo';
import Contact from './models/Contact';
import Conversation, { ConversationStatus }
  from './models/Conversation';
import ConversationSettingsData from './models/ConversationSettingsData';
import GroupSettingsData from './models/GroupSettingsData';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';
import Message from './models/Message';
import type SocketApi from '../../common/api/MessengerApi/SocketApi';
import type ConversationInfo from './models/ConversationInfo';
import type BusinessProfile from '../profiles/models/BusinessProfile';
import type GroupMember from './models/GroupMember';
import type Store from '../index';

export default class CommunicationStore {
  @observable conversations: ObservableMap<Conversation> = observable.map();
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean = false;
  @observable error: string = '';

  @observable selectedConversationId: number;
  @observable selectedConversationSettings: ConversationSettingsData;

  @observable foundMessages: Array<Message>;
  @observable contactsFilter: string = '';

  @observable msgsForForward: Array<Message> = [];

  @observable contactsAutocomplete: Array = [];
  @observable contactsForAction: Array<Contact> = [];

  @observable messageForReply: Message = null;

  @observable selectedGroupSettings: GroupSettingsData = null;

  store: Store;
  socket: SocketApi;
  socketHandlers: SocketHandlers;
  socketObserver: Function;

  contactsAutocompleteDs: DataSource = new DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  groupMembersDs: DataSource = new DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  contactDs: DataSource = new DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
  });

  conversationDs: DataSource = new DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
  });

  constructor(store: Store) {
    this.store = store;
    this.socketHandlers = new SocketHandlers(this);

    // Allow to send typingStatus only once per 5sec
    this.updateTypingStatus = this::throttle(this.updateTypingStatus, 5000);
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

    this.conversationDs.isLoading = true;

    return apiHelper(apiPromise, this.contactDs)
      .cache('communication:messengerInfo:' + profile.id)
      .success((data: MessengerData) => {
        this.initSocket(data.wsUrl, data.messengerUser.id);
        this.messengerInfo = new MessengerInfo(data);

        this.conversations = observable.map();
        const conversation = this.messengerInfo.getDefaultConversation();

        // noinspection JSIgnoredPromiseFromCall
        this.setSelectedConversationId(conversation.id);

        return this.messengerInfo;
      })
      .promise();
  }

  @action
  async loadConversation(id: number) {
    const socket = await this.store.api.messenger.getSocket();
    const userId = socket.userId;
    const type = this.messengerInfo.getConversationType(id);

    return apiHelper(socket.getConversation({ id, type }), this.conversationDs)
      .cache(`communication:conversations:${userId}:${id}`)
      .success((data) => {
        const conversation = new Conversation(data);
        this.conversations.merge({ [id]: observable(conversation) });
        return conversation;
      })
      .promise();
  }

  @action
  async setSelectedConversationId(id) {
    this.selectedConversationId = id;
    if (id) {
      const conversation = this.conversations.get(id);
      if (!conversation) {
        //noinspection JSIgnoredPromiseFromCall
        await this.loadConversation(id);
      }

      await this.markConversationAsRead(id);
    }
  }

  @action
  async markConversationAsRead(id) {
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
      await socket.updateMessagesReadStatus(unreadIds);
    }
  }

  @action
  async search(text) {
    this.contactsFilter = (text || '').toLowerCase();

    if (!text) {
      this.foundMessages = [];
      return;
    }

    //noinspection JSIgnoredPromiseFromCall
    await this.searchMessages(text);
  }

  @action
  searchContactsAutocomplete(query) {
    const { api: { messenger } } = this.store;
    const { messengerUser } = this.messengerInfo;

    return apiHelper(
      messenger.getAvailableContacts(messengerUser.id, query),
      this.contactsAutocompleteDs
    ).success((data) => {
      this.contactsAutocomplete = data;
    })
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

    return socket.sendMessage(options);
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
  setMessageForReply(message: Message) {
    this.messageForReply = message;
  }

  @action
  removeMessageForReply() {
    this.messageForReply = null;
  }

  @action
  async saveUserSettings(settings: UserSettings) {
    const { api: { messenger } } = this.store;
    const { messengerUser } = this.messengerInfo;

    // save to local
    apiHelper(messenger.saveSettings(messengerUser.id, settings))
      .success(() => {
        // Save changes to local
        extendObservable(this.messengerInfo, {
          userSettings: new UserSettings(settings),
        });
      });
  }

  @action
  async updateTypingStatus(conversationId) {
    const socket = await this.store.api.messenger.getSocket();
    return await socket.updateTypingStatus(conversationId);
  }

  @computed
  get contactsAutocompDataSource() {
    return this.contactsAutocompleteDs.cloneWithRows(
      this.contactsAutocomplete.slice()
    );
  }

  @computed
  get groupMembersDataSource() {
    let chatGroupMembers = [];
    if (this.selectedGroupSettings) {
      chatGroupMembers = this.selectedGroupSettings.members.slice();
    }

    return this.groupMembersDs.cloneWithRows(chatGroupMembers);
  }

  @computed
  get contactDataSource() {
    const filter = this.contactsFilter;
    const info = this.messengerInfo;

    let contacts = info ? info.conversations.slice() : [];
    let groups   = info ? info.groups.slice() : [];
    const foundMessages = this.foundMessages.slice();

    if (filter) {
      contacts = contacts.filter(c => c.name.toLowerCase().includes(filter));
      groups = groups.filter(c => c.name.toLowerCase().includes(filter));
    }

    return this.contactDs.cloneWithRowsAndSections(
      { contacts, groups, foundMessages },
      ['contacts', 'groups', 'foundMessages']
    );
  }

  @computed
  get selectedConversation(): Conversation {
    return this.conversations.get(this.selectedConversationId);
  }

  @computed
  get selectedConversationDataSource() {
    const conversation = this.selectedConversation;
    const messages = conversation ? conversation.messages : [];
    return this.conversationDs.cloneWithRows(messages.slice());
  }

  @computed get isMsgsForForwardAvailable() {
    return this.msgsForForward.length > 0;
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
  async deleteMessage(messageId) {
    const socket = await this.store.api.messenger.getSocket();

    if (this.checkMsgInForForward(messageId)) {
      this.removeMessageFromForward(messageId);
    }

    if (this.messageForReply && this.messageForReply.id === messageId) {
      this.messageForReply = null;
    }

    return socket.deleteMessage(messageId);
  }

  @action
  async editMessage(id, newValue) {
    const socket = await this.store.api.messenger.getSocket();

    return socket.editMessage({ id, newValue });
  }

  @action
  addMessageForForward(message: Message) {
    if (this.checkMsgInForForward(message.id)) return;

    this.msgsForForward.push(message);
  }

  @action
  removeMessageFromForward(messageId: number) {
    this.msgsForForward =
      this.msgsForForward.filter(message => message.id !== messageId);
  }

  @action
  checkMsgInForForward(messageId: number) {
    return !!this.msgsForForward.find(message => message.id === messageId);
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
  clearAddForActionContacts() {
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
    )).success(() => {
      // Do not need to save locally it comeback from WebSockets
    });
  }

  @action
  async getConversationSettings() {
    const socket = await this.store.api.messenger.getSocket();
    apiHelper(socket.getConversationSettings(this.selectedConversationId), this)
      .success((data) => {
        this.selectedConversationSettings = new ConversationSettingsData(data);
      });
  }

  @action
  async changeConvNotificationProp(state) {
    const socket = await this.store.api.messenger.getSocket();

    apiHelper(socket.changeConvNotificationProp(
      this.selectedConversationId, state
    )).success();
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
  async getSelectedGroupSettings() {
    const groupId = this.selectedConversationId;
    let currentGroupSettings = null;

    if (this.selectedConversation.type === 'chat-group') {
      currentGroupSettings = await this.getChatGroupSettings(groupId);
    } else if (this.selectedConversation.type === 'marketing-group') {
      currentGroupSettings = await this.getMarketingGroupSettings(groupId);
    }

    this.selectedGroupSettings = new GroupSettingsData(currentGroupSettings);
  }

  @action
  async removeGroupMember(groupId: number, memberId: number) {
    const socket = await this.store.api.messenger.getSocket();
    this.selectedGroupSettings.removeMember(memberId);

    apiHelper(socket.removeGroupMember(groupId, memberId))
      .success(() => {
        this.markConversationAsRead(this.selectedConversationId);
      })
      .error(log.error);
  }

  @action
  async addGroupMember(groupId: number, memberAlias: string) {
    const socket = await this.store.api.messenger.getSocket();
    return apiHelper(socket.addGroupMember(groupId, memberAlias))
      .success((data) => {
        this.selectedGroupSettings.addMember(data);

        // Mark conversation as read to avoid badge appearance
        this.markConversationAsRead(this.selectedConversationId);
      })
      .promise();
  }

  @action
  addAllMembersToGroup(groupId: number) {
    const members = this.contactsForAction.slice();
    members.forEach(async (member: GroupMember) => {
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
    const recipients = this.contactsForAction.slice()
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
    )).success();
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