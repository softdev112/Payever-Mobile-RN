/* eslint-disable max-len, global-require */
import Store from '../../../store';
import config from '../../../config';

describe('Store/Communication/UI', () => {
  let store;
  let communication;

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = null;
  });

  it('ChatMessagesState should be created in the communication store and initialize properly', () => {
    expect(communication.chatMessagesState).toBeTruthy();
    expect(communication.chatMessagesState.store).toBe(communication);
    expect(communication.chatMessagesState.ui).toBe(communication.ui);
  });

  describe('ChatMessagesState/actions', () => {
    it('initState() should put state to initial state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.searchMessagesMode = true;
      communication.ui.forwardMode = true;
      communication.ui.selectMode = true;
      communication.ui.pickContactMode = true;
      communication.ui.chatScreenOpen = true;

      communication.chatMessagesState.initState();

      expect(communication.messageForEdit).toBeNull();
      expect(communication.messageForReply).toBeNull();
      expect(communication.selectedMessages).toHaveLength(0);

      expect(communication.ui.searchMessagesMode).toBe(false);
      expect(communication.ui.forwardMode).toBe(false);
      expect(communication.ui.selectMode).toBe(false);
      expect(communication.ui.pickContactMode).toBe(false);
      expect(communication.ui.chatScreenOpen).toBe(false);
    });

    it('forwardState() should put state to Forward state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.forwardMode = false;
      communication.ui.selectMode = true;
      communication.ui.pickContactMode = true;

      communication.chatMessagesState.forwardState();

      expect(communication.messageForEdit).toBeNull();
      expect(communication.messageForReply).toBeNull();
      expect(communication.selectedMessages).toHaveLength(3);

      expect(communication.ui.forwardMode).toBe(true);
      expect(communication.ui.selectMode).toBe(false);
      expect(communication.ui.pickContactMode).toBe(false);
    });

    it('deleteState() should put state to Delete state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.forwardMode = true;
      communication.ui.selectMode = false;

      communication.chatMessagesState.deleteState();

      expect(communication.messageForEdit).toBeNull();
      expect(communication.messageForReply).toBeNull();
      expect(communication.selectedMessages).toHaveLength(3);

      expect(communication.ui.forwardMode).toBe(false);
      expect(communication.ui.selectMode).toBe(true);
    });

    it('replyState() should put state to Reply state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.searchMessagesMode = true;
      communication.ui.forwardMode = true;
      communication.ui.selectMode = true;

      communication.chatMessagesState.replyState();

      expect(communication.messageForEdit).toBeNull();
      expect(communication.messageForReply).not.toBeNull();
      expect(communication.selectedMessages).toHaveLength(0);

      expect(communication.ui.searchMessagesMode).toBe(false);
      expect(communication.ui.forwardMode).toBe(false);
      expect(communication.ui.selectMode).toBe(false);
    });

    it('editState() should put state to Edit state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.searchMessagesMode = true;
      communication.ui.forwardMode = true;
      communication.ui.selectMode = true;

      communication.chatMessagesState.editState();

      expect(communication.messageForEdit).not.toBeNull();
      expect(communication.messageForReply).toBeNull();
      expect(communication.selectedMessages).toHaveLength(0);

      expect(communication.ui.searchMessagesMode).toBe(false);
      expect(communication.ui.forwardMode).toBe(false);
      expect(communication.ui.selectMode).toBe(false);
    });

    it('selectForwardState() should put state to Forward with Selection state', () => {
      communication.messageForEdit = { message: 'Hello' };
      communication.messageForReply = { message: 'Hello' };
      communication.selectedMessages = ['contacts1', 'contacts2', 'contacts3'];

      communication.ui.searchMessagesMode = true;
      communication.ui.pickContactMode = false;
      communication.ui.forwardMode = false;
      communication.ui.selectMode = false;

      communication.chatMessagesState.selectForwardState();

      expect(communication.messageForEdit).toBeNull();
      expect(communication.messageForReply).toBeNull();
      expect(communication.selectedMessages).toHaveLength(3);

      expect(communication.ui.searchMessagesMode).toBe(false);
      expect(communication.ui.pickContactMode).toBe(true);
      expect(communication.ui.forwardMode).toBe(true);
      expect(communication.ui.selectMode).toBe(true);
    });
  });
});