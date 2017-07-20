/* eslint-disable max-len */
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { cacheHelper } from 'utils';
import config from '../../../config';
import ChooseAccount from '../screens/Contacts';
import Store from '../../../store';
import { profilesList } from '../../../store/profiles/__tests__/data';

jest.mock('../../../common/utils/networkHelper')
  .mock('../../../common/utils/cacheHelper')
  .mock('../../../common/ui/Loader', () => 'Loader');

const navigator = {
  setOnNavigatorEvent: jest.fn(),
  resetTo: jest.fn(),
  push: jest.fn(),
};

describe('modules/dashboard/screens/ChooseAccount', () => {
  let store;
  let profiles;

  beforeAll(() => {
    cacheHelper.isCacheUpToDate.mockImplementation(() => true);
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ChooseAccount should render correctly with dummy data', async () => {
    cacheHelper.loadFromCache.mockImplementationOnce(
      () => Promise.resolve(JSON.parse(JSON.stringify(profilesList)))
    );

    await profiles.load();
    profiles.load = jest.fn();

    const tree = renderer.create(
      <ChooseAccount
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('ChooseAccount should render with Loader while profiles.isLoading === true', async () => {
    profiles.isLoading = true;

    const tree = renderer.create(
      <ChooseAccount
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('ChooseAccount should render only add new business profile if there are no profiles', async () => {
    const tree = renderer.create(
      <ChooseAccount
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('ChoseAccount/onProfileClick(profile: Profile) test press to select profile should work properly', async () => {
    cacheHelper.loadFromCache.mockImplementationOnce(
      () => Promise.resolve(JSON.parse(JSON.stringify(profilesList)))
    );

    await profiles.load();
    profiles.load = jest.fn();
    profiles.setCurrentProfile = jest.fn();

    const wrapper = shallow((
      <ChooseAccount
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ));

    // TODO: Find the way if any to avoid long calls chain
    // Dive to IconText to simulate onPress
    wrapper.dive()
      .dive()
      .find('GridView')
      .dive()
      .dive()
      .dive()
      .dive()
      .childAt(0)
      .childAt(0)
      .dive()
      .childAt(0)
      .dive()
      .childAt(0)
      .props()
      .onPress();

    expect(profiles.setCurrentProfile).toHaveBeenCalled();
    expect(navigator.resetTo).toHaveBeenCalled();
    expect(navigator.resetTo).toHaveBeenCalledWith(
      { animated: true, screen: 'dashboard.Private' }
    );
  });

  it('ChoseAccount/onProfileClick(profile: Profile) test click to add new business should work properly', async () => {
    profiles.setCurrentProfile = jest.fn();

    const wrapper = shallow((
      <ChooseAccount
        profiles={profiles}
        ui={store.ui}
        navigator={navigator}
      />
    ));

    // TODO: Find the way if any to avoid long calls chain
    // Dive to IconText to simulate onPress
    wrapper.dive()
      .dive()
      .find('GridView')
      .dive()
      .dive()
      .dive()
      .dive()
      .childAt(0)
      .childAt(0)
      .dive()
      .childAt(0)
      .dive()
      .childAt(0)
      .props()
      .onPress();

    expect(profiles.setCurrentProfile).not.toHaveBeenCalled();
    expect(navigator.resetTo).not.toHaveBeenCalled();
    expect(navigator.push).not.toHaveBeenCalledWith();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'dashboard.AddNewBusiness' }
    );
  });
});