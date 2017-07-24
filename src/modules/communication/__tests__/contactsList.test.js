/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import { shallow } from 'enzyme';
import { cacheHelper, networkHelper } from 'utils';
import config from '../../../config';
import ContactsScreen from '../screens/Contacts';
import Store from '../../../store';
import navigator from '../../../../__mocks__/navigator';
import { messengerData } from '../../../store/communication/__tests__/data';
import { profilesList } from '../../../store/profiles/__tests__/data';
import MessengerInfo from '../../../store/communication/models/MessengerInfo';

jest.mock('../../../common/utils/cacheHelper')
  .mock('../../../common/utils/networkHelper')
  .mock('../../../common/ui/Icon', () => 'Icon');

describe('modules/communication/screens/Contacts', () => {
  let store;
  let communication;
  let profiles;
  let ui;

  beforeAll(() => {
    ContactsScreen.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    ContactsScreen.childContextTypes = { navigator: React.PropTypes.object };

    cacheHelper.loadFromCache.mockImplementation(() => Promise.resolve(
      cloneObject(messengerData)
    ));
    cacheHelper.isCacheUpToDate.mockImplementation(() => true);
    cacheHelper.saveToCache.mockImplementation(() => Promise.resolve());
    networkHelper.isConnected.mockImplementation(() => false);
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
    communication = store.communication;
    communication.initSocket = jest.fn();
    ui = store.ui;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Contacts should render correctly if NOT in pickContactMode', async (done) => {
    store.ui.phoneMode = true;
    communication.ui.pickContactMode = false;
    communication.loadMessengerInfo = jest.fn(() => {
      communication.messengerInfo =
        new MessengerInfo(JSON.parse(JSON.stringify(messengerData)));
    });

    const tree = renderer.create(
      <Provider
        profiles={profiles}
        communication={communication}
        ui={ui}
      >
        <ContactsScreen navigator={navigator} />
      </Provider>
    ).toJSON();

    setTimeout(() => {
      expect(tree).toMatchSnapshot();
      done();
    }, 1000);
  });

  it('Contacts should render correctly in pickContactMode', async () => {
    store.ui.phoneMode = true;
    communication.ui.pickContactMode = true;

    await communication.loadMessengerInfo(profilesList.businesses_own[0]);

    const tree = renderer.create(
      <Provider
        profiles={profiles}
        communication={communication}
        ui={ui}
      >
        <ContactsScreen navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Contacts/onCancelForwarding() should call navigator.push => communication.Chat and don NOT switch select forward mode', () => {
    communication.loadMessengerInfo = jest.fn(() => {
      communication.messengerInfo = cloneObject(messengerData);
    });

    communication.ui.selectMode = true;
    communication.ui.forwardMode = true;
    communication.ui.pickContactMode = true;

    const wrapper = shallow(
      <ContactsScreen
        communication={communication}
        profiles={profiles}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .dive()
      .childAt(0)
      .dive()
      .childAt(0)
      .childAt(0)
      .props()
      .onPress();

    expect(communication.ui.selectMode).toBe(true);
    expect(communication.ui.forwardMode).toBe(true);
    expect(communication.ui.pickContactMode).toBe(true);
    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: false, screen: 'communication.Chat' }
    );
  });
});