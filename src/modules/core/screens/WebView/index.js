import { Component } from 'react';
import { WebView as ReactWebView, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { StyleSheet } from 'ui';
import type { Navigator } from 'react-native-navigation';

import injectedCode, { getLoaderHtml } from './injectedCode';
import WebViewLoader from './WebViewLoader';
import WebViewError from './WebViewError';
import { showScreen, toggleMenu } from '../../../../common/Navigation';
import type AuthStore from '../../../../store/AuthStore';
import type UserProfilesStore from '../../../../store/UserProfilesStore';

const BACK_ON_URLS = [
  { urlMask: '/home',    screen: 'dashboard.Dashboard', authRequired: true },
  { urlMask: '/private', screen: 'dashboard.Private',   authRequired: true },
  { urlMask: '/login',   screen: 'auth.Login' },
];

@inject('auth', 'userProfiles')
@observer
export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    injectOptions?: Object;
    navigator: Navigator;
    referer?: string;
    url: string;
    userProfiles?: UserProfilesStore;
  };

  state: {
    errorMsg: string;
  };

  $view: ReactWebView;
  injectedCode: string;

  constructor(props) {
    super(props);

    this.injectedCode = injectedCode({
      isDev: __DEV__,
      ...props.injectOptions,
    });

    this.state = {
      errorMsg: '',
    };
  }

  onError({ nativeEvent }) {
    this.setState({
      errorMsg: nativeEvent.description,
    });
  }

  onLoadStart({ nativeEvent }) {
    const { auth } = this.props;

    if (nativeEvent.url.startsWith('react-js-navigation')) {
      return;
    }

    // Process submit events ONLY iOS UIWebKit there is no such
    // field in android WebKit nativeEvent
    if (nativeEvent.navigationType === 'formsubmit') {
      if (nativeEvent.url.endsWith('/create-business')) {
        this.refreshBusinesesWithTimeout();
      }

      // After create-business it goes to business home just block
      if (nativeEvent.url.endsWith('/home')) {
        this.$view.stopLoading();
        this.props.navigator.pop({ animated: true });
        return;
      }
    }

    BACK_ON_URLS.forEach((url) => {
      if (nativeEvent.url.endsWith(url.urlMask)) {
        //noinspection JSUnresolvedFunction
        this.$view.stopLoading();

        if (url.authRequired && !auth.isLoggedIn) {
          showScreen('auth.Login');
          return;
        }
        showScreen(url.screen);
      }
    });
  }

  onMessage({ nativeEvent: { data } }) {
    const object = JSON.parse(data);

    switch (object.command) {
      case 'show-menu': {
        toggleMenu(this.props.navigator);
        break;
      }
      case 'error': {
        console.warn(
          `WebView error: ${data.errorMsg} at ${data.url}:${data.lineNumber}`
        );
        log(
          `WebView error: ${data.errorMsg} at ${data.url}:${data.lineNumber}`
        );
        this.props.navigator.pop({ animated: true });
        break;
      }

      case 'add-business':
        this.props.navigator.pop({ animated: true });
        this.refreshBusinesesWithTimeout();
        break;

      case 'go-back':
        this.props.navigator.pop({ animated: true });
        break;

      default: {
        console.warn(`Unknown webview command ${object.command}`);
      }
    }
  }

  refreshBusinesesWithTimeout() {
    if (!this.refreshTimer) {
      this.refreshTimer = setTimeout(() => {
        // Reload businesses with some delay
        this.props.userProfiles.load();
      }, 1200);
    }
  }

  renderError() {
    return (
      <WebViewError
        message={this.state.errorMsg || 'Restart application please!'}
        navigator={this.props.navigator}
      />
    );
  }

  render() {
    const { navigator, url, referer } = this.props;

    let source;
    if (referer) {
      log('Loading with referer', referer);
      const headers = {};
      if (referer) {
        headers.Referer = referer;
      }
      source = { headers, uri: url };
    } else {
      log('Loading through html');
      source = { html: getLoaderHtml(url) };
    }

    return (
      <View style={styles.container}>
        <ReactWebView
          source={source}
          ref={$v => this.$view = $v}
          onError={::this.onError}
          onLoadStart={::this.onLoadStart}
          onMessage={::this.onMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          injectedJavaScript={this.injectedCode}
          renderLoading={() => <WebViewLoader navigator={navigator} />}
          renderError={::this.renderError}
          bounces={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    '@media ios and (orientation: portrait)': {
      marginTop: 15,
    },
  },
});