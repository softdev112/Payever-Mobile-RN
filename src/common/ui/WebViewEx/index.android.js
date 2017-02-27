/* eslint-disable max-len,import/extensions,import/no-unresolved,
   import/no-extraneous-dependencies */
/**
 * @providesModule WebViewEx
 */

import { PropTypes } from 'react';
import {
  ActivityIndicator,
  UIManager,
  View,
  requireNativeComponent,
  WebView as ReactWebView,
} from 'react-native';

import resolveAssetSource from 'resolveAssetSource';
import keyMirror from 'fbjs/lib/keyMirror';

import { log } from '../../utils';
import StyleSheet from '../StyleSheet';

const RCT_WEBVIEW_REF = 'webview';

const WebViewExState = keyMirror({
  IDLE: null,
  LOADING: null,
  ERROR: null,
});

const defaultRenderLoading = () => (
  <View style={styles.loadingView}>
    <ActivityIndicator
      style={styles.loadingProgressBar}
    />
  </View>
);

export default class WebViewEx extends ReactWebView {
  static defaultProps = {
    ...ReactWebView.defaultProps,
    uploadEnabledAndroid: true,
  };

  static propTypes = {
    ...ReactWebView.propTypes,
    uploadEnabledAndroid: PropTypes.bool,
  };

  goForward() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebViewEx.Commands.goForward,
      null
    );
  }

  goBack() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebViewEx.Commands.goBack,
      null
    );
  }

  postMessage(data) {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebViewEx.Commands.postMessage,
      [String(data)]
    );
  }

  reload() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebViewEx.Commands.reload,
      null
    );
  }

  stopLoading() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebViewEx.Commands.stopLoading,
      null
    );
  }

  render() {
    let otherView = null;

    if (this.state.viewState === WebViewExState.LOADING) {
      otherView = (this.props.renderLoading || defaultRenderLoading)();
    } else if (this.state.viewState === WebViewExState.ERROR) {
      const errorEvent = this.state.lastErrorEvent;
      otherView = this.props.renderError && this.props.renderError(
          errorEvent.domain,
          errorEvent.code,
          errorEvent.description);
    } else if (this.state.viewState !== WebViewExState.IDLE) {
      log.error(
        'RCTWebViewEx invalid state encountered: ' + this.state.loading
      );
    }

    const webViewExStyles = [styles.container, this.props.style];
    if (this.state.viewState === WebViewExState.LOADING ||
      this.state.viewState === WebViewExState.ERROR) {
      // if we're in either LOADING or ERROR states, don't show the webView
      webViewExStyles.push(styles.hidden);
    }

    const source = this.props.source || {};
    if (this.props.html) {
      source.html = this.props.html;
    } else if (this.props.url) {
      source.uri = this.props.url;
    }

    if (source.method === 'POST' && source.headers) {
      log.warn('WebViewEx: source.headers is not supported when using POST.');
    } else if (source.method === 'GET' && source.body) {
      log.warn('WebViewEx: `source.body` is not supported when using GET.');
    }

    const webViewEx = (
      <RCTWebViewEx
        ref={RCT_WEBVIEW_REF}
        key="webViewKey"
        style={webViewExStyles}
        source={resolveAssetSource(source)}
        scalesPageToFit={this.props.scalesPageToFit}
        injectedJavaScript={this.props.injectedJavaScript}
        userAgent={this.props.userAgent}
        javaScriptEnabled={this.props.javaScriptEnabled}
        domStorageEnabled={this.props.domStorageEnabled}
        messagingEnabled={typeof this.props.onMessage === 'function'}
        onMessage={::this.onMessage}
        contentInset={this.props.contentInset}
        automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
        onContentSizeChange={this.props.onContentSizeChange}
        onLoadingStart={::this.onLoadingStart}
        onLoadingFinish={::this.onLoadingFinish}
        onLoadingError={::this.onLoadingError}
        testID={this.props.testID}
        mediaPlaybackRequiresUserAction={this.props.mediaPlaybackRequiresUserAction}
        allowUniversalAccessFromFileURLs={this.props.allowUniversalAccessFromFileURLs}
        uploadEnabledAndroid={this.props.uploadEnabledAndroid}
      />
    );

    return (
      <View style={styles.container}>
        {webViewEx}
        {otherView}
      </View>
    );
  }
}

const RCTWebViewEx = requireNativeComponent('RCTWebViewEx', WebViewEx, {
  nativeOnly: {
    messagingEnabled: PropTypes.bool,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hidden: {
    height: 0,
    flex: 0, // disable 'flex:1' when hiding a View
  },

  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingProgressBar: {
    height: 20,
  },
});