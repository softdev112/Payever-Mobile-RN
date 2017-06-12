import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigation } from 'react-native-navigation';
import { NavBar, StyleSheet, View, WebView } from 'ui';
import UIStore from '../../../store/ui';

@inject('ui')
@observer
export default class DeepLinksPopup extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    ui: UIStore;
  };

  async onClose() {
    const { ui } = this.props;
    Navigation.dismissModal({ animated: true });
    ui.setDeepLink('');
  }

  render() {
    const { ui } = this.props;
    const js = `(${injectedJs.toString()})()`;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClose} />
          <NavBar.Title title="Payever" showTitle="always" />
        </NavBar>
        <WebView
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ url: ui.deepLink }}
        />
      </View>
    );
  }
}

function injectedJs() {
  // eslint-disable-next-line no-undef
  callWebViewOnMessage({ command: 'hide-loader' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});