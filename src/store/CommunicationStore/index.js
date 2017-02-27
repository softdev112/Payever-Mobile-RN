import {
  action, autorun, computed, extendObservable, observable, ObservableMap,
} from 'mobx';
import { apiHelper } from 'utils';
import { DataSource } from 'ui';

import type Store from '../index';
import UserSettings from './models/UserSettings';
import MessengerInfo from './models/MessengerInfo';
import Conversation, { ConversationType, ConversationStatus }
  from './models/Conversation';
import type BusinessProfile from '../UserProfilesStore/models/BusinessProfile';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';
import Message from './models/Message';

export default class CommunicationStore {
  @observable conversations: ObservableMap<Conversation> = observable.map();
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean;
  @observable error: string;

  @observable foundMessages: Array<Message>;
  @observable contactsFilter: string = '';

  store: Store;
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
  }

  @action
  async loadMessengerInfo(profile: BusinessProfile): Promise<MessengerInfo> {
    const { api } = this.store;

    let apiPromise;
    if (profile.isBusiness) {
      apiPromise = api.messenger.getBusiness(profile.business.slug);
    } else {
      apiPromise = api.messenger.getPrivate();
    }

    return apiHelper(apiPromise, this.contactDs)
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
  async loadConversation(
    id: number,
    type: ConversationType
  ): Promise<Conversation> {
    const socket = await this.store.api.messenger.getSocket();
    const userId = socket.userId;

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
    return apiHelper(socket.searchMessages({ query }))
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

  @action
  updateUserStatus(status: ConversationStatus) {
    this.conversations.forEach((conversation: Conversation) => {
      if (conversation.status.userId !== status.userId) return;
      conversation.updateStatus(status);
    });
    this.messengerInfo.conversations.forEach((conversation: Conversation) => {
      if (conversation.status.userId !== status.userId) return;
      conversation.updateStatus(status);
    });
  }

  getConversationDataSource(conversationId, isGroup = false) {
    const collection = isGroup ? this.groupConversations : this.conversations;
    const conversation = collection.get(conversationId);
    const messages = conversation ? conversation.messages : [];
    return this.conversationDs.cloneWithRows(messages.slice());
  }

  initSocket(url, userId) {
    const { api, auth } = this.store;

    const socket = api.messenger.connectToWebSocket(
      url,
      userId,
      auth.getAccessToken()
    );

    this.socketHandlers.subscribe(socket);

    if (this.socketObserver) {
      this.socketObserver();
    }
    this.socketObserver = autorun(() => {
      socket.setAccessToken(auth.getAccessToken());
    });
  }
}