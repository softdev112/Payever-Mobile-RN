import { Component } from 'react';
import { WebView as ReactWebView } from 'react-native';

export default class WebView extends Component {
  render() {
    const { url } = this.props;
    return (
      <ReactWebView source={{ uri: url }} />
    );
  }
}