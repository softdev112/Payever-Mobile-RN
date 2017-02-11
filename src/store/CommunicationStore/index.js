import { action, autorun, observable } from 'mobx';
import { apiHelper } from 'utils';

import type Store from '../index';
import MessengerInfo from './models/MessengerInfo';
import Conversation from './models/Conversation';
import type BusinessProfile from '../UserProfilesStore/models/BusinessProfile';
import { MessengerData } from '../../common/api/MessengerApi';
import SocketHandlers from './SocketHandlers';

export default class CommunicationStore {
  @observable conversations: Object<Conversation> = {};
  @observable messengerInfo: MessengerInfo;

  @observable isLoading: boolean;
  @observable error: string;

  store: Store;
  socketHandlers: SocketHandlers;
  socketObserver: Function;

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
  async sendMessage(conversationId, body) {
    const socket = await this.store.api.messenger.getSocket();
    return socket.sendMessage({ conversationId, body });
  }

  @action
  async saveUserSettings() {
    const { api: { messenger } } = this.store;
    const { messengerUser, userSettings } = this.messengerInfo;

    return messenger.saveSettings(messengerUser.id, userSettings);
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