import { Component } from 'react';
import { WebView as ReactWebView, View } from 'react-native';
import { StyleSheet } from 'ui';
import type { Navigator } from 'react-native-navigation';

import injectedCode, { getLoaderHtml } from './injectedCode';
import WebViewLoader from './WebViewLoader';
import { toggleMenu } from '../../../../common/Navigation';


export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    url: string;
    referer?: string;
  };

  $view: ReactWebView;
  injectedCode: string;

  constructor(props) {
    super(props);
    this.injectedCode = injectedCode({ isDev: __DEV__ });
  }

  onLoadStart({ nativeEvent }) {
    const { navigator } = this.props;

    if (nativeEvent.url.startsWith('react-js-navigation')) {
      return;
    }

    if (nativeEvent.url.endsWith('/home')) {
      //noinspection JSUnresolvedFunction
      this.$view.stopLoading();
      navigator.pop();
    }

    if (nativeEvent.url.endsWith('/private')) {
      //noinspection JSUnresolvedFunction
      this.$view.stopLoading();
      navigator.pop();
    }
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
          onLoadStart={::this.onLoadStart}
          onMessage={::this.onMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          injectedJavaScript={this.injectedCode}
          renderLoading={() => <WebViewLoader navigator={navigator} />}
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