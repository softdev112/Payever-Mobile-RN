/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { cacheHelper } from 'utils';
import config from '../../../config';
import SideMenu from '../screens/SideMenu';
import Store from '../../../store';
import { profilesList } from '../../../store/profiles/__tests__/data';
import navigator from '../../../../__mocks__/navigator';
import { hideMenu, showScreen } from '../../../common/Navigation';

jest.mock('../../../common/utils/cacheHelper')
  .mock('../../../common/utils/networkHelper')
  .mock('../../../common/Navigation');

describe('modules/core/screens/SideMenu', () => {
  let store;
  let profiles;
  let auth;

  beforeAll(() => {
    cacheHelper.isCacheUpToDate.mockImplementation(() => true);
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
    auth = store.auth;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('SideMenu should render correctly with dummy data', async () => {
    cacheHelper.loadFromCache.mockImplementationOnce(
      () => Promise.resolve(JSON.parse(JSON.stringify(profilesList)))
    );

    await profiles.load();

    const tree = renderer.create(
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('SideMenu/onAddNewBusiness() should call navigator.push => dashboard.AddNewBusiness', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('Text')
      .at(2)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'dashboard.AddNewBusiness' }
    );
  });

  it('SideMenu/onLogout() should call auth.logout and showScreen => core.LaunchScreen', () => {
    auth.logout = jest.fn(() => Promise.resolve());
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('Text')
      .last()
      .props()
      .onPress();

    expect(auth.logout).toHaveBeenCalled();
    expect(showScreen).toHaveBeenCalled();
    expect(showScreen).toHaveBeenCalledWith('core.LaunchScreen');
  });

  it('SideMenu/onContactsList() should call navigator.push => contacts.BusinessContacts', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('TextButton')
      .at(0)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith(
      { animated: true, screen: 'contacts.BusinessContacts' }
    );
  });

  it('SideMenu/onClose() should call hideMenu', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('Icon')
      .at(0)
      .props()
      .onPress();

    expect(hideMenu).toHaveBeenCalled();
    expect(hideMenu).toHaveBeenCalledWith(navigator);
  });

  it('SideMenu/onUserPress() should call navigator.push => dashboard.Private', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('Text')
      .at(1)
      .props()
      .onPress();

    expect(showScreen).toHaveBeenCalled();
    expect(showScreen).toHaveBeenCalledWith('dashboard.Private');
  });

  it('SideMenu/onProfileSettingsPress() should call navigator.push => core.WebView', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .find('Icon')
      .at(1)
      .props()
      .onPress();

    expect(navigator.push).toHaveBeenCalled();
    expect(navigator.push).toHaveBeenCalledWith({
      passProps: { url: undefined },
      screen: 'core.WebView',
    });
  });

  it('SideMenu/onProfileSelect(profile: BusinessProfile) should call showScreen => dashboard.Dashboard', () => {
    profiles.privateProfile = profilesList.private;

    const wrapper = shallow((
      <SideMenu
        profiles={profiles}
        auth={auth}
        navigator={navigator}
      />
    ));

    wrapper.dive()
      .dive()
      .childAt(1)
      .dive()
      .find('BusinessList')
      .props()
      .onSelect(profilesList.businesses_own[0]);

    expect(showScreen).toHaveBeenCalled();
    expect(showScreen).toHaveBeenCalledWith('dashboard.Dashboard');
  });
});