/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'mobx-react/native';
import { shallow } from 'enzyme';
import config from '../../../config';
import GeneralSettings from '../screens/GeneralSettings';
import Store from '../../../store';
import MessengerInfo from '../../../store/communication/models/MessengerInfo';
import { messengerData } from '../../../store/communication/__tests__/data';
import navigator from '../../../../__mocks__/navigator';

jest.mock(
    '../components/settings/SwitchableSliderPref',
    () => 'SwitchableSliderPref'
  ).mock(
    '../components/settings/SwitchableTimePeriodPref',
    () => 'SwitchableTimePeriodPref'
  );

describe('modules/communication/screens/GeneralSettings', () => {
  let store;
  let communication;

  beforeAll(() => {
    GeneralSettings.prototype.getChildContext = function getContext() {
      return { navigator };
    };

    GeneralSettings.childContextTypes = { navigator: React.PropTypes.object };
  });

  beforeEach(() => {
    store = new Store(config);
    communication = store.communication;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GeneralSettings should render correctly', () => {
    const conversationId = messengerData.conversations[0].id;
    communication.selectedConversationId = conversationId;
    communication.messengerInfo = new MessengerInfo(messengerData);

    const tree = renderer.create(
      <Provider
        communication={communication}
      >
        <GeneralSettings navigator={navigator} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('GeneralSettings/onSavePress() should render correctly', () => {
    communication.saveUserSettings = jest.fn();

    const wrapper = shallow(
      <GeneralSettings
        communication={communication}
        navigator={navigator}
      />
    );

    wrapper.dive()
      .dive()
      .find('NavBar')
      .find('Button')
      .props()
      .onPress();

    expect(communication.saveUserSettings).toHaveBeenCalled();
    expect(navigator.pop).toHaveBeenCalled();
  });
});