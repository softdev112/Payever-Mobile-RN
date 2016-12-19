import { Component } from 'react';
import { WebView as ReactWebView } from 'react-native';
import { StyleSheet } from 'ui';

import injectedCode from './injectedCode';

export default class WebView extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  props: {
    navigator: Navigator
  };

  $view: ReactWebView;
  injectedCode: string;

  constructor(props) {
    super(props);
    this.injectedCode = injectedCode();
  }

  onLoadStart(event) {
    const { navigator } = this.props;
    const { nativeEvent } = event;

    if (nativeEvent.url.endsWith('/home')) {
      this.$view.stopLoading();
      navigator.pop();
    }
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
    const { url } = this.props;
    return (
      <ReactWebView
        style={styles.component}
        source={{ uri: url }}
        ref={$v => this.$view = $v}
        onLoadStart={::this.onLoadStart}
        onMessage={::this.onMessage}
        javaScriptEnabled={true}
        injectedJavaScript={this.injectedCode}
      />
    );
  }
}

const styles = StyleSheet.create({
  component: {
    '@media ios': {
      marginTop: 20
    }
  },
});