/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import config from '../../../config';
import ConversationSettings from '../screens/ConversationSettings';
import Store from '../../../store';
import MessengerInfo from '../../../store/communication/models/MessengerInfo';
import { messengerData } from '../../../store/communication/__tests__/data';
import navigator from '../../../../__mocks__/navigator';

describe('modules/communication/screens/ConversationSettings', () => {
  let store;
  let communication;

  beforeAll(() => {
    ConversationSettings.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    ConversationSettings.childContextTypes = { navigator: React.PropTypes.object };
  });

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ConversationSettings should render correctly', () => {
    const conversationId = messengerData.conversations[0].id;
    communication.selectedConversationId = conversationId;
    communication.messengerInfo = new MessengerInfo(messengerData);
    communication.conversations
      .set(conversationId, communication.messengerInfo.byId(conversationId));
    communication.getConversationSettings = jest.fn(
      () => ({ notification: true })
    );

    const tree = renderer.create(
      <Provider
        communication={communication}
      >
        <ConversationSettings navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
    expect(communication.getConversationSettings).toHaveBeenCalled();
  });
});