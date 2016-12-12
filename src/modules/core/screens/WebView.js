import { Component } from 'react';
import { WebView as ReactWebView } from 'react-native';
import { StyleSheet } from 'ui';

export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  $view: ReactWebView;

  onLoadStart(event) {
    const { navigator } = this.props;
    const { nativeEvent } = event;

    if (nativeEvent.url.endsWith('/home')) {
      this.$view.stopLoading();
      navigator.pop();
    }
  }

  render() {
    const { url } = this.props;
    return (
      <ReactWebView
        style={styles.component}
        source={{ uri: url }}
        ref={$v => this.$view = $v}
        onLoadStart={::this.onLoadStart}
      />
    );
  }
}

const styles = StyleSheet.create({
  component: {
    '@media ios': {
      marginTop: 10
    }
  },
});