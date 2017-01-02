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

const BACK_ON_URLS = [
  { urlMask: '/home',    screen: 'dashboard.Dashboard', authRequired: true },
  { urlMask: '/private', screen: 'dashboard.Private',   authRequired: true },
  { urlMask: '/login',   screen: 'auth.Login' },
];

@inject('auth')
@observer
export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    navigator: Navigator;
    url: string;
    referer?: string;
  };

  state: {
    errorMsg: string,
    canGoBack: boolean,
    isLoading: boolean,
  };

  $view: ReactWebView;
  injectedCode: string;

  constructor(props) {
    super(props);
    this.injectedCode = injectedCode({ isDev: __DEV__ });

    this.state = {
      errorMsg: '',
      canGoBack: false,
      isLoading: false,
    };
  }

  onError({ nativeEvent }) {
    this.setState({
      errorMsg: nativeEvent.description,
      canGoBack: nativeEvent.canGoBack,
    });
  }

  onLoadEnd() {
    this.setState({
      isLoading: false,
    });
  }

  onLoadStart({ nativeEvent }) {
    const { auth } = this.props;

    if (nativeEvent.url.startsWith('react-js-navigation')) {
      return;
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

    this.setState({
      isLoading: true,
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
        break;
      }
      default: {
        console.warn(`Unknown webview command ${object.command}`);
      }
    }
  }

  onRefreshPress(goBack: boolean = false) {
    // Try to refresh page after error
    if (!this.$view) {
      this.props.navigator.pop();
      return;
    }

    if (goBack) {
      this.$view.goBack();
    } else {
      this.$view.reload();
    }
  }

  renderError() {
    return (
      <WebViewError
        canGoBack={this.state.canGoBack}
        isReloading={this.state.isLoading}
        message={this.state.errorMsg
          || 'Sorry. Some Errors detected. Restart application please!'}
        navigator={this.props.navigator}
        onRefreshPress={::this.onRefreshPress}
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
          onLoadEnd={::this.onLoadEnd}
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