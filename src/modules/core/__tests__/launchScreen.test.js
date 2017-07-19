/* eslint-disable max-len */
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { deepLinksHelper } from 'utils';
import LaunchScreen from '../screens/LaunchScreen';
import Store from '../../../store';
import config from '../../../config';

jest.mock('../screens/LaunchScreen/SvgIconsShow', () => 'SvgIconsShow');

const navigator = {
  setOnNavigatorEvent: jest.fn(),
  resetTo: jest.fn(),
  push: jest.fn(),
};

describe('modules/core/screens/LaunchScreen', () => {
  let store;
  let profiles;

  beforeAll(() => {
    deepLinksHelper.processDeepLink = jest.fn();
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('LaunchScreen should render correctly and should NOT called processDeepLink if store.ui.deepLink not set', () => {
    const tree = renderer.create(
      <LaunchScreen
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();

    // componentDidMount with ui.deepLink = ''
    expect(deepLinksHelper.processDeepLink).not.toHaveBeenCalled();
  });

  it('LaunchScreen should render correctly and should call processDeepLink if store.ui.deepLink = url', () => {
    store.ui.deepLink = 'https://mein.payever.de';

    const tree = renderer.create(
      <LaunchScreen
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();

    // componentDidMount with ui.deepLink = url
    expect(deepLinksHelper.processDeepLink).toHaveBeenCalled();
    expect(deepLinksHelper.processDeepLink).toHaveBeenCalledWith(
      'https://mein.payever.de',
      expect.anything(),
      expect.objectContaining(navigator)
    );
  });

  it('LaunchScreen/onSignInPress() test press to signIn button should call navigator.push', () => {
    const wrapper = shallow((
      <LaunchScreen
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('TouchableOpacity')
      .at(0)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'auth.Login' }
    );
  });

  it('LaunchScreen/onCreateAccountPress() test press to signIn button should call navigator.push', () => {
    const wrapper = shallow((
      <LaunchScreen
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('TouchableOpacity')
      .at(1)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'auth.Register' }
    );
  });
});