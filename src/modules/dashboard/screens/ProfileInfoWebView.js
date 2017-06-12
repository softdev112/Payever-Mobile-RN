import { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View, WebView } from 'ui';
import BusinessProfile from '../../../store/profiles/models/BusinessProfile';
import PersonalProfile from '../../../store/profiles/models/PersonalProfile';
import { Config } from '../../../config';

@inject('config', 'auth')
@observer
export default class ProfileInfoWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profile: PersonalProfile | BusinessProfile;
    config: Config;
  };

  async onClose() {
    Navigation.dismissModal({ animated: true });
  }

  render() {
    const { profile, config } = this.props;
    const js = `(${injectedJs.toString()})()`;
    const url = `${config.siteUrl}/private/network/${profile.id}/profile`;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back onPress={::this.onClose} />
          <NavBar.Title title={profile.name} showTitle="always" />
        </NavBar>
        <WebView
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ url }}
          contentInset={{ top: -60 }}
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