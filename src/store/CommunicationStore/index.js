import { observable, action } from 'mobx';
import { apiHelper } from 'utils';

import type Store from '../index';
import MessengerInfo from './models/MessengerInfo';
import type Contact from './models/Contact';
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
  async loadContacts(): Promise<Contact[]> {
    this.isLoading = true;

    const { api } = this.store;
    const userId = this.userProfiles.currentProfile.id;
    console.log(userId);

    apiHelper(api.messenger.getAvailableContacts(), this)
      .success((resp: ApiResp) => {
        if (resp.data.length > 0) {
          this.items = resp.data.map(data => console.log(data));
        } else {
          this.error = 'Sorry, we didn\'t find any results, try ' +
            'searching again';
          this.items = [];
        }
      })
      .complete(() => this.isLoading = false);
  }

  @action
  async saveUserSettings() {
    const { api } = this.store;
    const { messengerUser, userSettings } = this.messengerInfo;

    const temp = Object.assign({}, userSettings);
    delete temp.id;

    console.log(messengerUser);
    if (MessengerInfo) {
      await api.messenger.saveSettings(messengerUser.id, temp);
    }
  }

  initSocket(url, userId) {
    const { api: { messenger }, auth } = this.store;
    const socket = messenger.connectToWebSocket(url, userId, auth.accessToken);
    this.socketHandlers.subscribe(socket);
  }
}