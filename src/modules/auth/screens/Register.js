import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View, WebView } from 'ui';
import type { Config } from '../../../config';

@inject('config')
@observer
export default class Register extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
  };

  render() {
    const { config } = this.props;
    const uri = config.siteUrl + '/register';
    const js = `(${injectedJs.toString()})()`;

    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back title="Back" />
          <NavBar.Title title="Add a contact" />
        </NavBar>
        <WebView
          contentInset={{ top: -60, left: 0, bottom: 0, right: 0 }}
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ uri }}
        />
      </View>
    );
  }
}

function injectedJs() {
  /* eslint-disable */
  setTimeout(() => {
    callWebViewOnMessage({ command: 'hide-loader' });
  }, 300);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});