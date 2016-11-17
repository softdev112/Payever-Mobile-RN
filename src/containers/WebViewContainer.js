import { Component } from 'react';
import { WebView, View } from 'react-native';

import { processNavigation } from '../utils/webviewRouter';

export default class WebViewContainer extends Component {

  $view: WebView;

  constructor(props) {
    super(props);

    this.state = {
      url: 'https://mein.payever.de/'
    };
  }

  componentWillUpdate(newProps) {
    if (newProps.url !== this.state.url) {
      this.state.url = newProps.url;
      console.log('Updating a webview with url ' + newProps.url + ' old: ' + this.state.url);
    }
  }

  onLoadStart(event) {
    const navigator = event.nativeEvent;

    if (navigator.url === this.state.url) {
      return;
    }

    console.log('onNavigationStateChange ' + navigator.url);

    const { navigationState } = this.props;
    if (processNavigation(navigator, navigationState)) {
    } else {
      this.$view.stopLoading();
      console.log('Stop navigating to ' + navigator.url);
    }
  }

  render() {
    const { url } = this.state;
    console.log('Rendering ' + url);
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={$v => this.$view = $v}
          source={{ uri: url }}
          onLoadStart={::this.onLoadStart}
        />
      </View>
    )
  }
}