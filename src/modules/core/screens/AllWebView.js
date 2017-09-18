import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { StyleSheet, View } from 'ui';
import WKWebView from 'react-native-wkwebview-reborn';
import type { Config } from '../../../config';

@inject('config')
@observer
export default class AllWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
  };

  render() {
    const { config } = this.props;

    return (
      <View style={styles.container}>
        <WKWebView
          ref={r => this.$webView = r}
          source={{ uri: config.siteUrl }}
          userAgent="Mozilla/5.0"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});