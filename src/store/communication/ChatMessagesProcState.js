import { action } from 'mobx';
import CommunicationStore from './index';
import CommunicationUI from './ui';

export default class ChatMessagesProcState {
  store: CommunicationStore;
  ui: CommunicationUI;

  constructor(store: CommunicationStore, ui: CommunicationUI) {
    this.store = store;
    this.ui = ui;
  }

  @action
  initState() {
    // Communication Store
    this.store.messageForReply = null;
    this.store.messageForEdit = null;
    this.store.selectedMessages = [];

    // Communication UI
    this.ui.searchMessagesMode = false;
    this.ui.forwardMode = false;
    this.ui.selectMode = false;
    this.ui.pickContactMode = false;
    this.ui.chatScreenOpen = false;
  }

  @action
  forwardState() {
    // Communication Store
    this.store.messageForReply = null;
    this.store.messageForEdit = null;

    // Communication UI
    this.ui.forwardMode = true;
    this.ui.selectMode = false;
    this.ui.pickContactMode = false;
  }

  @action
  deleteState() {
    // Communication Store
    this.store.messageForReply = null;
    this.store.messageForEdit = null;

    // Communication UI
    this.ui.selectMode = true;
    this.ui.forwardMode = false;
  }

  @action
  replyState() {
    // Communication Store
    this.store.messageForEdit = null;
    this.store.selectedMessages = [];

    // Communication UI
    this.ui.searchMessagesMode = false;
    this.ui.forwardMode = false;
    this.ui.selectMode = false;
  }

  @action
  editState() {
    // Communication Store
    this.store.messageForReply = null;
    this.store.selectedMessages = [];

    // Communication UI
    this.ui.searchMessagesMode = false;
    this.ui.forwardMode = false;
    this.ui.selectMode = false;
  }

  @action
  selectForwardState() {
    // Communication Store
    this.store.messageForEdit = null;
    this.store.messageForReply = null;

    // Communication UI
    this.ui.searchMessagesMode = false;
    this.ui.pickContactMode = true;
    this.ui.forwardMode = true;
    this.ui.selectMode = true;
  }
}