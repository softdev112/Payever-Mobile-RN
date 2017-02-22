/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule WebViewEx
 */

import { Component, PropTypes } from 'react';
import {
  ActivityIndicator,
  EdgeInsetsPropType,
  UIManager,
  View,
  requireNativeComponent,
  findNodeHandle,
} from 'react-native';
/* eslint-disable */
import deprecatedPropType from 'deprecatedPropType';
import resolveAssetSource from 'resolveAssetSource';
import keyMirror from 'fbjs/lib/keyMirror';
/* eslint-enable */
import * as log from '../../utils/log';
import StyleSheet from '../StyleSheet';

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

/**
 * Renders a native WebViewEx
 */
export default class WebViewEx extends Component {
  static propTypes = {
    ...View.propTypes,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadEnd: PropTypes.func,
    onLoadStart: PropTypes.func,
    onError: PropTypes.func,
    automaticallyAdjustContentInsets: PropTypes.bool,
    contentInset: EdgeInsetsPropType,
    onNavigationStateChange: PropTypes.func,
    onMessage: PropTypes.func,
    onContentSizeChange: PropTypes.func,
    startInLoadingState: PropTypes.bool, // force WebView to show loadingView
    style: View.propTypes.style,
    /**
     * Used on Android only, allow upload files in WebView from Camera and
     * Gallery add ChromeWebClient to WebView with overriden openFileChooser
     * @platform android
     */
    uploadEnabledAndroid: PropTypes.bool,

    html: deprecatedPropType(
      PropTypes.string,
      'Use the `source` prop instead.'
    ),

    url: deprecatedPropType(
      PropTypes.string,
      'Use the `source` prop instead.'
    ),

    /**
     * Loads static html or a uri (with optional headers) in the WebView.
     */
    source: PropTypes.oneOfType([
      PropTypes.shape({
        /*
         * The URI to load in the WebView. Can be a local or remote file.
         */
        uri: PropTypes.string,
        /*
         * The HTTP Method to use. Defaults to GET if not specified.
         * NOTE: On Android, only GET and POST are supported.
         */
        method: PropTypes.oneOf(['GET', 'POST']),
        /*
         * Additional HTTP headers to send with the request.
         * NOTE: On Android, this can only be used with GET requests.
         */
        headers: PropTypes.object,
        /*
         * The HTTP body to send with the request. This must be a valid
         * UTF-8 string, and will be sent exactly as specified, with no
         * additional encoding (e.g. URL-escaping or base64) applied.
         * NOTE: On Android, this can only be used with POST requests.
         */
        body: PropTypes.string,
      }),
      PropTypes.shape({
        /*
         * A static HTML page to display in the WebView.
         */
        html: PropTypes.string,
        /*
         * The base URL to be used for any relative links in the HTML.
         */
        baseUrl: PropTypes.string,
      }),
      /*
       * Used internally by packager.
       */
      PropTypes.number,
    ]),

    /**
     * Used on Android only, JS is enabled by default for WebView on iOS
     * @platform android
     */
    javaScriptEnabled: PropTypes.bool,

    /**
     * Used on Android only, controls whether DOM Storage is enabled or not
     * @platform android
     */
    domStorageEnabled: PropTypes.bool,

    /**
     * Sets the JS to be injected when the webpage loads.
     */
    injectedJavaScript: PropTypes.string,

    /**
     * Sets whether the webpage scales to fit the view and the
     * user can change the scale.
     */
    scalesPageToFit: PropTypes.bool,

    /**
     * Sets the user-agent for this WebView. The user-agent can
     * also be set in native using
     * WebViewConfig. This prop will overwrite that config.
     */
    userAgent: PropTypes.string,

    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: PropTypes.string,

    /**
     * Determines whether HTML5 audio & videos require the user to tap
     * before they can start playing. The default value is `false`.
     */
    mediaPlaybackRequiresUserAction: PropTypes.bool,

    /**
     * Boolean that sets whether JavaScript running in the context of a file
     * scheme URL should be allowed to access content from any origin.
     * Including accessing content from other file scheme URLs
     * @platform android
     */
    allowUniversalAccessFromFileURLs: PropTypes.bool,
  };

  static defaultProps = {
    javaScriptEnabled: true,
    scalesPageToFit: true,
  };

  state = {
    viewState: WebViewExState.IDLE,
    lastErrorEvent: null,
    startInLoadingState: true,
  };

  componentWillMount() {
    if (this.props.startInLoadingState) {
      this.setState({ viewState: WebViewExState.LOADING });
    }
  }

  onLoadingStart(event) {
    const onLoadStart = this.props.onLoadStart;
    if (onLoadStart) {
      onLoadStart(event);
    }

    this.updateNavigationState(event);
  }

  onLoadingError(event) {
    event.persist(); // persist this event because we need to store it
    const { onError, onLoadEnd } = this.props;
    if (onError) {
      onError(event);
    }

    if (onLoadEnd) {
      onLoadEnd(event);
    }

    log.warn('Encountered an error loading page', event.nativeEvent);
    this.setState({
      lastErrorEvent: event.nativeEvent,
      viewState: WebViewExState.ERROR,
    });
  }

  onLoadingFinish(event) {
    const { onLoad, onLoadEnd } = this.props;
    if (onLoad) {
      onLoad(event);
    }

    if (onLoadEnd) {
      onLoadEnd(event);
    }

    this.setState({
      viewState: WebViewExState.IDLE,
    });
    this.updateNavigationState(event);
  }

  onMessage(event) {
    const { onMessage } = this.props;
    if (onMessage) {
      onMessage(event);
    }
  }

  getWebViewHandle() {
    return findNodeHandle(this.webViewExRef);
  }

  goForward() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWebView.Commands.goForward,
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

  /**
   * We return an event with a bunch of fields including:
   *  url, title, loading, canGoBack, canGoForward
   */
  updateNavigationState(event) {
    if (this.props.onNavigationStateChange) {
      this.props.onNavigationStateChange(event.nativeEvent);
    }
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
        ref={webViewExRef => this.webViewExRef = webViewExRef}
        key="webViewExKey"
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
        // eslint-disable-next-line max-len
        automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
        onContentSizeChange={this.props.onContentSizeChange}
        onLoadingStart={::this.onLoadingStart}
        onLoadingFinish={::this.onLoadingFinish}
        onLoadingError={::this.onLoadingError}
        testID={this.props.testID}
        // eslint-disable-next-line max-len
        mediaPlaybackRequiresUserAction={this.props.mediaPlaybackRequiresUserAction}
        // eslint-disable-next-line max-len
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