import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { images, NavBar, StyleSheet, View } from 'ui';
import Contacts from '../components/contacts';
import UIStore from '../../../store/ui';

@inject('ui')
@observer
export default class ContactsList extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    ui: UIStore;
  };

  context: {
    navigator: Navigator;
  };

  onGoBack() {
    const { ui } = this.props;
    ui.tabBarUI.setSelectedIndex(ui.tabBarUI.tabs.dashboard);
    this.context.navigator.pop({ animated: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back onPress={::this.onGoBack} />
          <NavBar.Title title="Communication" source={images.communication} />
          <NavBar.Menu />
        </NavBar>
        <Contacts style={styles.contacts} phoneView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },

  contacts: {
    flex: 1,
  },
});