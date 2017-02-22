import { Component } from 'react';
import { WebView } from 'ui';

/* eslint-disable react/prefer-stateless-function */
export default class Terminal extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    url: string;
  };

  render() {
    return (
      <WebView
        topMarginIos
        source={{ uri: this.props.url }}
        showNavBar="always"
      />
    );
  }
}