import { Component } from 'react';
import type { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';

import SavedContactsList from '../components/contacts/SavedContactsList';

export default class AddContactToGroup extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
  };

  $savedContactsList: SavedContactsList;

  onSaveSelectedContacts() {
    const { navigator } = this.props;
    this.$savedContactsList.wrappedInstance.saveSelectedContacts();
    this.$savedContactsList = null;
    navigator.pop({ animated: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back />
          <NavBar.Title title="Add Contact" />
          <NavBar.Button title="Save" onPress={::this.onSaveSelectedContacts} />
        </NavBar>
        <View style={styles.content}>
          <SavedContactsList
            ref={ref => this.$savedContactsList = ref}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});