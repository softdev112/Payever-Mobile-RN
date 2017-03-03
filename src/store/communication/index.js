import {
  action, autorun, computed, extendObservable, observable, ObservableMap,
} from 'mobx';
import { apiHelper, log } from 'utils';
import { DataSource } from 'ui';
import { throttle } from 'lodash';

import type Store from '../index';
import UserSettings from './models/UserSettings';
import MessengerInfo from './models/MessengerInfo';
import Conversation, { ConversationStatus }
  from './models/Conversation';
import type BusinessProfile from '../profiles/models/BusinessProfile';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';
import Message from './models/Message';
import type SocketApi from '../../common/api/MessengerApi/SocketApi';
import type ConversationInfo from './models/ConversationInfo';

export default class CommunicationStore {
  @observable conversations: ObservableMap<Conversation> = observable.map();
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean;
  @observable error: string;

  @observable selectedConversationId: number;

  @observable foundMessages: Array<Message>;
  @observable contactsFilter: string = '';

  store: Store;
  socket: SocketApi;
  socketHandlers: SocketHandlers;
  socketObserver: Function;

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

    // Allow to send typingStatus only once per 5s
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

        //noinspection JSIgnoredPromiseFromCall
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
    const conversation = this.conversations.get(id);
    if (!conversation) {
      //noinspection JSIgnoredPromiseFromCall
      await this.loadConversation(id);
    }

    return await this.markConversationAsRead(id);
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
  search(text) {
    this.contactsFilter = (text || '').toLowerCase();

    if (!text) {
      this.foundMessages = [];
      return;
    }

    //noinspection JSIgnoredPromiseFromCall
    this.searchMessages(text);
  }

  @action
  async sendMessage(conversationId, body) {
    const socket = await this.store.api.messenger.getSocket();
    return socket.sendMessage({ conversationId, body });
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
  get contactDataSource() {
    const filter = this.contactsFilter;
    const info = this.messengerInfo;

    let contacts = info ? info.conversations.slice() : [];
    let groups   = info ? info.groups.slice() : [];
    const foundMessages = this.foundMessages.slice();

    if (filter) {
      contacts = contacts.filter(c => c.name.toLowerCase().contains(filter));
      groups = groups.filter(c => c.name.toLowerCase().contains(filter));
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