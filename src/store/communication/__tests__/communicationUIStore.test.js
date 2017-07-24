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

  it('Communication UI should be created in the main store with right default state', () => {
    expect(communication.ui).toBeTruthy();
    expect(communication.ui.searchMessagesMode).toBe(false);
    expect(communication.ui.forwardMode).toBe(false);
    expect(communication.ui.selectMode).toBe(false);
    expect(communication.ui.pickContactMode).toBe(false);
    expect(communication.ui.chatScreenOpen).toBe(false);
    expect(communication.ui.chatFooterHeight).toBe(50);
  });

  describe('Communication UI/actions', () => {
    it('setSearchMessagesMode(mode: boolean) should set ui.searchMessagesMode', () => {
      expect(communication.ui.searchMessagesMode).toBe(false);
      communication.ui.setSearchMessagesMode(true);
      expect(communication.ui.searchMessagesMode).toBe(true);

      communication.ui.setSearchMessagesMode(false);
      expect(communication.ui.searchMessagesMode).toBe(false);
    });

    it('setSelectMode(mode: boolean) should set ui.setSelectMode', () => {
      expect(communication.ui.selectMode).toBe(false);
      communication.ui.setSelectMode(true);
      expect(communication.ui.selectMode).toBe(true);

      communication.ui.setSelectMode(false);
      expect(communication.ui.selectMode).toBe(false);
    });

    it('setForwardMode(mode: boolean) should set ui.setForwardMode', () => {
      expect(communication.ui.forwardMode).toBe(false);
      communication.ui.setForwardMode(true);
      expect(communication.ui.forwardMode).toBe(true);

      communication.ui.setForwardMode(false);
      expect(communication.ui.forwardMode).toBe(false);
    });

    it('setPickContactMode(mode: boolean) should set ui.setPickContactMode', () => {
      expect(communication.ui.pickContactMode).toBe(false);
      communication.ui.setPickContactMode(true);
      expect(communication.ui.pickContactMode).toBe(true);

      communication.ui.setPickContactMode(false);
      expect(communication.ui.pickContactMode).toBe(false);
    });

    it('setChatScreenOpen(chatOpen: boolean) should set ui.setChatScreenOpen', () => {
      expect(communication.ui.chatScreenOpen).toBe(false);
      communication.ui.setChatScreenOpen(true);
      expect(communication.ui.chatScreenOpen).toBe(true);

      communication.ui.setChatScreenOpen(false);
      expect(communication.ui.chatScreenOpen).toBe(false);
    });

    it('setChatFooterHeight(height: number) should set ui.setChatFooterHeight', () => {
      expect(communication.ui.chatFooterHeight).toBe(50);
      communication.ui.setChatFooterHeight(100);
      expect(communication.ui.chatFooterHeight).toBe(100);

      communication.ui.setChatFooterHeight(150);
      expect(communication.ui.chatFooterHeight).toBe(150);
    });
  });
});