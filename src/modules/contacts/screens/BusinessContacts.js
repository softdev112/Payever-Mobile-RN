import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { SegmentedControl, NavBar, StyleSheet, View } from 'ui';

import ContactsStore from '../../../store/contacts';
import CustomerContactsList from '../components/CustomerContactsList';

@inject('contacts')
@observer
export default class BusinessContacts extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    contacts: ContactsStore;
    navigator: Navigator;
  };

  $businessContactsList: CustomerContactsList;

  onAddContact() {
    this.props.navigator.push({
      screen: 'contacts.AddNewCustomerContact',
      animated: true,
    });
  }

  onAddSelected() {
    this.props.navigator.pop({ animated: true });
  }

  onCancelSelectMode() {
    const { contacts, navigator } = this.props;
    contacts.ui.setSelectMode(false);
    contacts.clearSelectedContacts();
    navigator.pop({ animated: true });
  }

  render() {
    const { contacts } = this.props;

    return (
      <View style={styles.container}>
        <NavBar>
          {contacts.ui.selectMode ? (
            <NavBar.Button
              align="left"
              title="Cancel"
              onPress={::this.onCancelSelectMode}
            />
          ) : (
            <NavBar.Back />
          )}
          <NavBar.ComplexTitle>
            <SegmentedControl
              style={{ width: 150 }}
              values={['Customers', 'Groups']}
              selectedIndex={0}
            />
          </NavBar.ComplexTitle>

          {contacts.ui.selectMode ? (
            <NavBar.Button
              title="Add"
              onPress={::this.onAddSelected}
            />
          ) : (
            <NavBar.IconButton
              source="icon-plus-24"
              onPress={::this.onAddContact}
            />
          )}
        </NavBar>
        <View style={styles.content}>
          <CustomerContactsList
            ref={ref => this.$businessContactsList = ref}
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