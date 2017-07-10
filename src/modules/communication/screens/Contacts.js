import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { images, NavBar, StyleSheet, View } from 'ui';
import Contacts from '../components/contacts';

import CommunicationStore from '../../../store/communication';
import ProfilesStore from '../../../store/profiles';

@inject('communication', 'profiles')
@observer
export default class ContactsScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    profiles: ProfilesStore;
    navigator: Navigator;
    style?: Object;
  };

  async componentDidMount() {
    const { communication, profiles } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    if (!communication.ui.pickContactMode) {
      await communication.loadMessengerInfo(profiles.currentProfile);
    }
  }

  onCancelForwarding() {
    const { communication, navigator } = this.props;
    communication.ui.setSelectMode(true);
    communication.ui.setPickContactMode(false);
    navigator.push({
      screen: 'communication.Chat',
      animated: false,
    });
  }

  render() {
    const { communication, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <NavBar>
          {communication.ui.pickContactMode ? (
            <NavBar.Button
              title="Cancel"
              align="left"
              onPress={::this.onCancelForwarding}
            />
          ) : (
            <NavBar.Back />
          )}

          {communication.ui.pickContactMode ? (
            <NavBar.Title title="Choose recipient" showTitle="always" />
          ) : (
            <NavBar.Title title="Communication" source={images.communication} />
          )}
          <NavBar.Menu />
        </NavBar>
        <Contacts id={communication.selectedConversationId} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});