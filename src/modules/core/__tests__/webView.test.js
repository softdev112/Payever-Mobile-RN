/* eslint-disable max-len */
import React from 'react';
import renderer from 'react-test-renderer';
import { Linking } from 'react-native';
import { shallow } from 'enzyme';
import { cacheHelper, networkHelper, log } from 'utils';
import config from '../../../config';
import WebView from '../screens/WebView';
import Store from '../../../store';
import navigator from '../../../../__mocks__/navigator';
import { showScreen, toggleMenu } from '../../../common/Navigation';

jest.mock('../../../common/utils/cacheHelper')
  .mock('../../../common/utils/networkHelper')
  .mock('react-native-logging')
  .mock('../../../common/Navigation')
  .mock('Linking', () => ({
    openURL: jest.fn(() => Promise.resolve()),
  }));

describe('modules/core/screens/WebView', () => {
  let store;
  let profiles;
  let auth;

  beforeAll(() => {
    cacheHelper.isCacheUpToDate.mockImplementation(() => true);
    networkHelper.isConnected.mockImplementation(() => true);
  });

  beforeEach(() => {
    store = new Store(config);
    profiles = store.profiles;
    auth = store.auth;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('WebView should render correctly if network connection available and should NOT call navigator.showModal', () => {
    const tree = renderer.create(
      <WebView
        profiles={profiles}
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();

    // componentWillMount
    expect(networkHelper.isConnected).toHaveBeenCalled();
    expect(navigator.showModal).not.toHaveBeenCalled();
  });

  it('WebView/componentWillMount() should call navigator.showModal if network connection NOT available', async () => {
    jest.useFakeTimers();
    networkHelper.isConnected.mockImplementationOnce(() => false);

    await renderer.create(
      <WebView
        profiles={profiles}
        auth={auth}
        config={store.config}
        navigator={navigator}
      />
    ).toJSON();

    expect(networkHelper.isConnected).toHaveBeenCalled();
    expect(navigator.showModal).toHaveBeenCalled();
    expect(navigator.showModal).toHaveBeenCalledWith({
      passProps: {
        message: networkHelper.errorConnection,
        onBack: expect.any(Function),
      },
      screen: 'core.ErrorPage',
    });
    expect(setTimeout).toHaveBeenCalledTimes(1);

    jest.clearAllTimers();
  });

  describe('WebView/onLoadStart({ nativeEvent })', () => {
    it('WebView/onLoadStart({ nativeEvent }) should call Linking.openURL if it comes from external url', () => {
      const openUrlSpy = jest.spyOn(Linking, 'openURL');

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: 'https://www.github.com',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(openUrlSpy).toHaveBeenCalled();
      expect(openUrlSpy).toHaveBeenCalledWith('https://www.github.com');
    });

    it('WebView/onLoadStart({ nativeEvent }) should NOT call Linking.openURL if it comes from payever url and user logged In', () => {
      const openUrlSpy = jest.spyOn(Linking, 'openURL');

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/some_url',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(openUrlSpy).not.toHaveBeenCalled();
    });

    it('WebView/onLoadStart({ nativeEvent }) should call navigator.pop if it go to url ends with /home and user loggedIn', () => {
      auth.isLoggedIn = true;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/home',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).toHaveBeenCalled();
      expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
    });

    it('WebView/onLoadStart({ nativeEvent }) should NOT call navigator.pop and should call showScreen if url ends with /home and user NOT loggedIn', () => {
      auth.isLoggedIn = false;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/home',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).not.toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('auth.Login');
    });

    it('WebView/onLoadStart({ nativeEvent }) should call navigator.pop if it go to url ends with /private and user loggedIn', () => {
      auth.isLoggedIn = true;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/private',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).toHaveBeenCalled();
      expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
    });

    it('WebView/onLoadStart({ nativeEvent }) should NOT call navigator.pop and should call showScreen if url ends with /private and user NOT loggedIn', () => {
      auth.isLoggedIn = false;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/private',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).not.toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalled();
      expect(showScreen).toHaveBeenCalledWith('auth.Login');
    });

    it('WebView/onLoadStart({ nativeEvent }) should call navigator.pop if it go to url ends with /login and user loggedIn', () => {
      auth.isLoggedIn = true;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/login',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).toHaveBeenCalled();
      expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
    });

    it('WebView/onLoadStart({ nativeEvent }) should call navigator.pop and should NOT call showScreen if url ends with /login and user NOT loggedIn', () => {
      auth.isLoggedIn = false;

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/login',
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onLoadStart(event);

      expect(navigator.pop).toHaveBeenCalled();
      expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
      expect(showScreen).not.toHaveBeenCalled();
    });
  });

  describe('WebView/onMessage({ nativeEvent })', () => {
    it('WebView/onMessage({ nativeEvent }) should call parse command if it gets bad url or url not from payever', () => {
      const jsonSpy = jest.spyOn(JSON, 'parse');

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event1 = {
        nativeEvent: {
          url: 'https://www.github.com',
        },
      };

      const event2 = {
        nativeEvent: {
          url: '',
        },
      };

      const event3 = {
        nativeEvent: {},
      };

      const event4 = {
        nativeEvent: {
          url: config.siteUrl + '/about:blank',
        },
      };

      const webView = wrapper.dive().find('WebView');

      webView.props()
        .onMessage(event1);
      webView.props()
        .onMessage(event2);
      webView.props()
        .onMessage(event3);
      webView.props()
        .onMessage(event4);

      expect(jsonSpy).not.toHaveBeenCalled();
    });

    it('WebView/onMessage({ nativeEvent }) should call toggleMenu if get command show-menu', () => {
      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/common',
          data: JSON.stringify({ command: 'show-menu' }),
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onMessage(event);

      expect(toggleMenu).toHaveBeenCalled();
      expect(toggleMenu).toHaveBeenCalledWith(navigator);
    });

    it('WebView/onMessage({ nativeEvent }) should call navigator.pop if get command error', () => {
      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/common',
          data: JSON.stringify({ command: 'error' }),
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onMessage(event);

      expect(navigator.pop).toHaveBeenCalled();
      expect(navigator.pop).toHaveBeenCalledWith({ animated: true });
    });

    it('WebView/onMessage({ nativeEvent }) should call log.warn if get unknown command', () => {
      log.warn = jest.fn();

      const wrapper = shallow(
        <WebView
          profiles={profiles}
          auth={auth}
          config={store.config}
          navigator={navigator}
          enableExternalBrowser
        />
      );

      const event = {
        nativeEvent: {
          url: config.siteUrl + '/common',
          data: JSON.stringify({ command: 'unknown' }),
        },
      };

      wrapper.dive()
        .find('WebView')
        .props()
        .onMessage(event);

      expect(log.warn).toHaveBeenCalled();
      expect(log.warn).toHaveBeenCalledWith('Unknown webview command unknown');
    });
  });
});