import type CommunicationStore from './index';

export default class SocketHandlers {
  store: CommunicationStore;

  constructor(store: CommunicationStore) {
    this.store = store;
  }

  subscribe() {

  }
}