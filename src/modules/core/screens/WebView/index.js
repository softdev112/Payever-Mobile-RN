import { Component } from 'react';
import { WebView as ReactWebView, View, Linking } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet } from 'ui';
import { log } from 'utils';

import injectedCode, { getLoaderHtml } from './injectedCode';
import WebViewError from './WebViewError';
import { showScreen, toggleMenu } from '../../../../common/Navigation';
import type AuthStore from '../../../../store/AuthStore';
import type UserProfilesStore from '../../../../store/UserProfilesStore';
import type { Config } from '../../../../config';

const BACK_ON_URLS = [
  { urlMask: '/home',    screen: 'dashboard.Dashboard', authRequired: true },
  { urlMask: '/private', screen: 'dashboard.Private',   authRequired: true },
  { urlMask: '/login',   screen: 'auth.Login' },
];

@inject('auth', 'userProfiles', 'config')
@observer
export default class WebView extends Component {
  static defaultProps = {
    enableExternalBrowser: false,
  };

  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    auth: AuthStore;
    config: Config;
    enableExternalBrowser?: boolean;
    injectOptions?: Object;
    navigator: Navigator;
    referer?: string;
    url: string;
    userProfiles?: UserProfilesStore;
  };

  state: {
    errorMsg: string;
    isCustomNavBar: boolean;
    title: string;
    titleImgUrl: string;
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
      isCustomNavBar: false,
      title: '',
      titleImgUrl: '',
    };
  }

  onError({ nativeEvent }) {
    this.setState({
      errorMsg: nativeEvent.description,
    });
  }

  onGoBack() {
    //noinspection JSUnresolvedFunction
    this.$view.goBack();
  }

  onLoadStart({ nativeEvent }) {
    const { auth } = this.props;

    if (nativeEvent.url.startsWith('react-js-navigation')) {
      return;
    }

    this.setState({ isCustomNavBar: false });

    if (nativeEvent.url
      && !nativeEvent.url.startsWith(this.props.config.siteUrl)
      && !nativeEvent.url.includes('about:blank')
      && !nativeEvent.url.startsWith('data:text')) {
      if (this.props.enableExternalBrowser) {
        // If enableExternalBrowser === true run link in a external browser
        //noinspection JSUnresolvedFunction
        this.$view.stopLoading();
        Linking.openURL(nativeEvent.url).catch(log.error);
        return;
      }

      // Switch on custom NavBar for navigation purpose on external sites
      // if they open in WebView
      this.setState({ isCustomNavBar: true });
      return;
    }


    // Apply pat
    // Process submit events ONLY iOS UIWebKit there is no such
    // field in android WebKit nativeEvent
    if (nativeEvent.navigationType === 'formsubmit') {
      if (nativeEvent.url.endsWith('/create-business')) {
        this.refreshBusinessesWithTimeout();
      }

      // After create-business it goes to business home just block
      if (nativeEvent.url.endsWith('/home')) {
        //noinspection JSUnresolvedFunction
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

  onMessage({ nativeEvent }) {
    const siteUrl = this.props.config.siteUrl;
    if (nativeEvent.url && !nativeEvent.url.startsWith(siteUrl)) return;

    const data = nativeEvent.data;
    const object = JSON.parse(data);
    switch (object.command) {
      case 'show-menu': {
        toggleMenu(this.props.navigator);
        break;
      }
      case 'error': {
        log.warn(
          `WebView error: ${data.errorMsg} at ${data.url}:${data.lineNumber}`
        );
        this.props.navigator.pop({ animated: true });
        break;
      }

      case 'add-business':
        this.props.navigator.pop({ animated: true });
        this.refreshBusinessesWithTimeout();
        break;

      case 'go-back':
        this.props.navigator.pop({ animated: true });
        break;

      case 'navbar-info': {
        this.setState({
          title: object.title,
          titleImgUrl: siteUrl + object.titleImgUrl,
        });
        console.log(siteUrl + object.titleImgUrl);
        break;
      }

      default: {
        log.warn(`Unknown webview command ${object.command}`);
      }
    }
  }

  refreshBusinessesWithTimeout() {
    if (!this.refreshTimer) {
      this.refreshTimer = setTimeout(() => {
        // Reload businesses with some delay
        //noinspection JSIgnoredPromiseFromCall
        this.props.userProfiles.load();
      }, 1200);
    }
  }

  renderError() {
    return (
      <WebViewError
        message={this.state.errorMsg}
        navigator={this.props.navigator}
      />
    );
  }

  render() {
    const { url, referer } = this.props;
    const { errorMsg, isCustomNavBar, title, titleImgUrl } = this.state;
    const topInset = isCustomNavBar ? -75 : 0;

    let source;
    if (referer) {
      const headers = {};
      if (referer) {
        headers.Referer = referer;
      }
      source = { headers, uri: url };
    } else {
      source = { html: getLoaderHtml(url) };
    }

    const titleImgSource = titleImgUrl ? { uri: titleImgUrl } : null;

    return (
      <View style={styles.container}>
        {isCustomNavBar && !errorMsg && (
          <NavBar>
            <NavBar.Back onPress={::this.onGoBack} />
            <NavBar.Title source={titleImgSource} title={title} />
            <NavBar.Menu />
          </NavBar>
        )}
        <ReactWebView
          contentInset={{ top: topInset, left: 0, bottom: 0, right: 0 }}
          source={source}
          ref={$v => this.$view = $v}
          onError={::this.onError}
          onLoadStart={::this.onLoadStart}
          onMessage={::this.onMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          injectedJavaScript={this.injectedCode}
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
    '@media ios': {
      marginTop: 15,
    },
  },
});