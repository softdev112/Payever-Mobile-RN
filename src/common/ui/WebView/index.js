import { Component, PropTypes } from 'react';
import { Linking, Platform, View, WebView as ReactWebView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { log } from 'utils';
import type { Config } from '../../../config';
import { showScreen } from '../../Navigation';
import NavBar from '../NavBar';
import StyleSheet from '../StyleSheet';
import getLoaderHtml from './getLoaderHtml';
import WebViewLoader from './WebViewLoader';
import WebViewError from './WebViewError';
import getInjectedJs from './getInjectedJs';

const REDIRECT_ON_URLS = [
  { match: '/home',    screen: 'dashboard.Dashboard' },
  { match: /private^/, screen: 'dashboard.Private' },
  { match: '/login',   screen: 'auth.Login' },
];

@inject('config')
@observer
export default class WebView extends Component {
  static defaultProps = {
    enableExternalBrowser: false,
    showLoader: false,
    showNavBar: 'external',
    topMarginIos: false,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    config?: Config;
    enableExternalBrowser?: boolean;
    injectJs?: string;
    onLoadStart?: (event: Object, webView: ReactWebView) => ?boolean;
    onMessage?: (message: Object) => ?boolean;

    /**
     * If the prop is RegExp or string and the current url matches to this prop
     * then navigate back. If the prop is object, than WebView will redirect to
     * obj.screen if url matches obj.match
     */
    redirectOn?: UrlMatch | Array<UrlMatch>;
    renderNavBar: (url: string, title: NavTitle, webView: WebView) => any;
    showLoader?: boolean;
    showNavBar?: 'never' | 'external' | 'always';
    source: Source;
    style: Object | number;
    topMarginIos: boolean;
  };

  state: {
    externalUrl: boolean;
    error: ?string;
    latestUrl: ?string;
    navTitle: ?NavTitle;
    showLoader: boolean;
  };

  $view: ReactWebView;
  latestUrl: ?string;

  constructor(props) {
    super(props);
    this.state = {
      externalUrl: false,
      error: null,
      latestUrl: null,
      navTitle: null,
      showLoader: props.showLoader,
    };
    this.internalInjectedJs = getInjectedJs({
      isDev: __DEV__,
      platform: Platform.OS,
    });
  }

  onLoadStart({ nativeEvent }) {
    const { url } = nativeEvent;
    const { enableExternalBrowser, onLoadStart, redirectOn } = this.props;
    const { navigator } = this.context;
    const payeverUrl = this.props.config.siteUrl;

    if (!url) return;

    if (url.startsWith('react-js-navigation')) {
      return;
    }

    if (onLoadStart && onLoadStart(nativeEvent, this.$view) === false) {
      return;
    }

    const externalUrl = isExternalUrl(url, payeverUrl);
    if (!enableExternalBrowser) {
      this.setState({ externalUrl });
    }

    if (enableExternalBrowser && externalUrl) {
      //noinspection JSUnresolvedFunction
      this.$view.stopLoading();
      Linking.openURL(nativeEvent.url).catch(log.error);
      return;
    }

    const redirect = redirectOnUrl(url, REDIRECT_ON_URLS.concat(redirectOn));
    if (redirect) {
      //noinspection JSUnresolvedFunction
      this.$view.stopLoading();
      if (redirect.back) {
        navigator.pop();
        return;
      }

      if (redirect.screen) {
        showScreen(redirect.screen);
      }
    }

    this.latestUrl = url;
  }

  onMessage({ nativeEvent }) {
    const { onMessage } = this.props;

    const json = nativeEvent.data || '{}';
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      log.warn(e);
      return;
    }

    if (onMessage && onMessage(data) === false) {
      return;
    }

    switch (data.command) {
      case 'back': {
        this.context.navigator.pop();
        break;
      }

      case 'error': {
        delete data.command;
        log.warn('WebView js error', data);
        break;
      }

      case 'hide-loader': {
        this.setState({ showLoader: false });
        break;
      }

      case 'set-title': {
        this.setState({ navTitle: data });
        break;
      }

      case 'show-error': {
        this.setState({ error: data.message });
        break;
      }

      default: {
        if (!onMessage) {
          log.warn(`Unknown webview command ${data.command}`);
        }
      }
    }
  }

  onGoBack() {
    if (!this.$view) return;
    //noinspection JSUnresolvedFunction
    this.$view.goBack();
  }

  renderError(domain, code, description) {
    if (domain || code) {
      log.error('WebView error', domain, code, description);
    }

    return (
      <WebViewError message={description} />
    );
  }

  renderNavBar() {
    const { showNavBar } = this.props;
    const { externalUrl, navTitle, showLoader } = this.state;

    if (showLoader) {
      return null;
    }

    if (this.props.renderNavBar) {
      return this.props.renderNavBar(
        this.this.latestUrl,
        navTitle,
        this
      );
    }

    if (showNavBar === 'never') return null;
    if (showNavBar === 'external' && !externalUrl) return null;

    return (
      <NavBar style={styles.navBar}>
        <NavBar.Back onPress={::this.onGoBack} />
        {navTitle && (
          <NavBar.Title
            source={{ uri: navTitle.image }}
            title={navTitle.text}
          />
        )}
        <NavBar.Menu />
      </NavBar>
    );
  }

  render() {
    const { config, injectJs, style, topMarginIos } = this.props;
    const { error, showLoader } = this.state;

    if (error) {
      return this.renderError(null, null, error);
    }

    const source = formatSource(this.props.source, config.siteUrl);

    const injectJsCode = this.internalInjectedJs + ';' + injectJs;

    const containerStyle = [
      styles.container,
      style,
      topMarginIos ? styles.container_topMarginIos : null,
    ];

    return (
      <View style={containerStyle}>
        {this.renderNavBar()}
        <ReactWebView
          bounces={false}
          domStorageEnabled
          injectedJavaScript={injectJsCode}
          javaScriptEnabled
          onLoadStart={::this.onLoadStart}
          onMessage={::this.onMessage}
          ref={$v => this.$view = $v}
          renderError={this.renderError}
          source={source}
          startInLoadingState={false}
        />
        {showLoader && <WebViewLoader />}
      </View>
    );
  }
}

export function isExternalUrl(url: string, payeverUrl) {
  if (!url) return false;
  if (url.startsWith('about:blank')) return false;
  if (url.startsWith('data:text')) return false;

  return !url.startsWith(payeverUrl);
}

export function formatSource(source: Source, baseUrl: string) {
  if (source.uri && source.uri.startsWith('/')) {
    source.uri = baseUrl + source.uri;
  }

  if (source.uri) {
    if (source.referer) {
      const referer = source.referer;
      delete source.referer;
      return { ...source, headers: { Referer: referer } };
    }

    return { html: getLoaderHtml(source.uri) };
  }

  return source;
}

export function redirectOnUrl(url: string, matches: Array<UrlMatch>): Redirect {
  url = url.split('#')[0];

  const matchResult = matches.find((match) => {
    if (match && typeof match === 'object' && match.match) {
      match = match.match;
    }

    if (typeof match === 'string') {
      return url.indexOf(match) !== -1;
    }

    if (match && match.test) {
      return !!url.match(match);
    }

    return false;
  });

  if (matchResult && matchResult.screen) {
    const copy = { ...matchResult };
    delete copy.match;
    return copy;
  }

  if (matchResult) {
    return { back: true };
  }

  return !!matchResult;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  container_topMarginIos: {
    '@media ios': {
      marginTop: 15,
    },
  },

  navBar: {
    '@media ios': {
      marginTop: 0,
    },
  },
});

type Source = {
  referer?: string;
  uri?: string;
};

type UrlMatch = string | RegExp | { match: UrlMatch; screen: string };

type Redirect = {
  screen: string;
  back?: boolean;
} | false;

type NavTitle = {
  image: string;
  title: string;
};