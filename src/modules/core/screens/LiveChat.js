import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View, WebView } from 'ui';
import { Config } from '../../../config';

@inject('config')
@observer
export default class LiveChat extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
  };

  async onClose() {
    Navigation.dismissModal({ animated: true });
  }

  render() {
    const { config } = this.props;
    const js = `(${injectedJs.toString()})()`;
    const url = `${config.siteUrl}`;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClose} />
          <NavBar.Title title="Payever Live Chat" showTitle="always" />
        </NavBar>
        <WebView
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ url }}
          contentInset={{ top: -45 }}
        />
      </View>
    );
  }
}

/* eslint-disable no-undef */
function injectedJs() {
  setTimeout(() => {
    return $zopim(() => {
      $zopim.livechat.set(chatConf.user);
      return $zopim.livechat.window.show();
    });
  }, 4000);

  setTimeout(() => callWebViewOnMessage({ command: 'hide-loader' }), 5000);
}
/* eslint-enable no-undef */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});