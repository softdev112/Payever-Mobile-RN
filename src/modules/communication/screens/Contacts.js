import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { images, NavBar, StyleSheet, View } from 'ui';
import Contacts from '../components/contacts';

import CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class ContactsScreen extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    style?: Object;
  };

  context: {
    navigator: Navigator;
  };

  onCancelForwarding() {
    const { communication } = this.props;
    communication.ui.setSelectMode(true);
    communication.ui.setPickContactMode(false);
    this.context.navigator.push({
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
        <Contacts />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});