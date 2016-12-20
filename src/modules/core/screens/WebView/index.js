import { Component } from 'react';
import { WebView as ReactWebView, View } from 'react-native';
import { StyleSheet } from 'ui';

import injectedCode from './injectedCode';
import WebViewLoader from './WebViewLoader';

const LOADER_HIDE_DELAY = 300;

export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  props: {
    navigator: Navigator
  };

  state: {
    isLoading: boolean;
  };

  $view: ReactWebView;
  injectedCode: string;
  mounted: boolean;

  constructor(props) {
    super(props);
    this.injectedCode = injectedCode();
    this.mounted = false;
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onLoadStart({ nativeEvent }) {
    const { navigator } = this.props;

    if (nativeEvent.url.endsWith('/home')) {
      this.$view.stopLoading();
      navigator.pop();
    }

    this.setState({ isLoading: true });
  }

  onLoadEnd() {
    // Prevent blinking, which isn't possible with renderLoading
    setTimeout(() => {
      if (this.mounted) {
        this.setState({ isLoading: false });
      } else {
        this.state.isLoading = false;
      }
    }, LOADER_HIDE_DELAY);
  }

  onMessage({ nativeEvent: { data } }) {
    const { navigator } = this.props;
    const object = JSON.parse(data);

    switch (object.command) {
      case 'show-menu': {
        navigator.toggleDrawer({
          side: 'right',
          animated: true
        });
      }
    }
  }

  render() {
    const { navigator, url } = this.props;
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        <ReactWebView
          style={styles.webView}
          source={{ uri: url }}
          ref={$v => this.$view = $v}
          onLoadStart={::this.onLoadStart}
          onLoadEnd={::this.onLoadEnd}
          onMessage={::this.onMessage}
          javaScriptEnabled={true}
          injectedJavaScript={this.injectedCode}
        />
        {isLoading && (
          <WebViewLoader navigator={navigator} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  webView: {
    '@media ios and (orientation: portrait)': {
      marginTop: 15
    }
  },
});