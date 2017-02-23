import { action, autorun, computed, extendObservable, observable } from 'mobx';
import { apiHelper } from 'utils';
import { ListView, ListViewDataSource } from 'react-native';

import type Store from '../index';
import UserSettings from './models/UserSettings';
import MessengerInfo from './models/MessengerInfo';
import Conversation from './models/Conversation';
import type BusinessProfile from '../UserProfilesStore/models/BusinessProfile';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';
import Message from './models/Message';

export default class CommunicationStore {
  @observable conversations: Object<Conversation> = {};
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean;
  @observable error: string;

  @observable foundMessages: Array<Message>;
  @observable contactsFilter: string = '';

  store: Store;
  socketHandlers: SocketHandlers;
  socketObserver: Function;

  contactsDs: ListViewDataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
  });

  searchDs: ListViewDataSource = new ListView.DataSource({
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

    return apiHelper(apiPromise, this)
      .cache('communication:messengerInfo:' + profile.id)
      .success((data: MessengerData) => {
        this.initSocket(data.wsUrl, data.messengerUser.id);
        this.messengerInfo = new MessengerInfo(data);
        this.conversations = {};
        return this.messengerInfo;
      })
      .promise();
  }

  @action
  async loadConversation(id: number): Promise<Conversation> {
    const socket = await this.store.api.messenger.getSocket();
    const userId = socket.userId;

    if (!id) {
      throw new Error('loadConversation: id is undefined');
    }

    return apiHelper(socket.getConversation({ id }), this)
      .cache(`communication:conversations:${userId}:${id}`)
      .success((data) => {
        const conversation = new Conversation(data);
        this.conversations[id] = conversation;
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
    return apiHelper(socket.searchMessages({ query }), this)
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
  get contactsDataSource() {
    const filter = this.contactsFilter;
    const info = this.messengerInfo;

    let contacts = info ? info.conversations.slice() : [];
    let groups   = info ? info.groups.slice() : [];
    const foundMessages = this.foundMessages.slice();

    if (filter) {
      contacts = contacts.filter(c => c.name.toLowerCase().contains(filter));
      groups = groups.filter(c => c.name.toLowerCase().contains(filter));
    }

    return this.contactsDs.cloneWithRowsAndSections(
      { contacts, groups, foundMessages },
      ['contacts', 'groups', 'foundMessages']
    );
  }

  @computed
  get searchDataSource() {
    return this.contactsDs.cloneWithRows(this.foundMessages.slice());
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