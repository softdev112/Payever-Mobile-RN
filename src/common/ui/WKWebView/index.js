import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { View } from 'react-native';
import RNWKWebView from 'react-native-wkwebview-reborn';

import type { Config } from '../../../config';
import StyleSheet from '../StyleSheet';
import WebViewLoader from './WebViewLoader';
import NoInetErrorPage from '../../../modules/core/screens/NoInetErrorPage';

@inject('config')
@observer
export default class WKWebView extends Component {
  props: {
    config: Config;
  };

  state: {
    showLoader: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      showLoader: true,
    };
  }

  onProgress(progress) {
    if (progress >= 1) {
      setTimeout(() => this.setState({ showLoader: false }), 1000);
    }
  }

  render() {
    const { config } = this.props;
    const { showLoader } = this.state;

    return (
      <View style={styles.container}>
        <RNWKWebView
          hideKeyboardAccessoryView
          ref={r => this.$webView = r}
          source={{ uri: config.siteUrl }}
          userAgent="Mozilla/5.0"
          onProgress={::this.onProgress}
          bounces={false}
          renderError={() => <NoInetErrorPage />}
        />

        {showLoader && <WebViewLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});