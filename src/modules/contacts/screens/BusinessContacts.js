import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { SegmentedControl, NavBar, StyleSheet, View } from 'ui';

import ContactsStore from '../../../store/contacts';
import CustomerContactsList from '../components/CustomerContactsList';
import ContactGroupsList from '../components/ContactGroupsList';

const SEGMENT_DATA = ['Customers', 'Groups'];

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

  state: {
    showContacts: boolean;
  };

  $list: CustomerContactsList | ContactGroupsList;

  constructor(props) {
    super(props);

    this.state = {
      showContacts: true,
    };
  }

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

  onShowContactsListSwitch(value) {
    this.setState({ showContacts: value === SEGMENT_DATA[0] });
  }

  render() {
    const { contacts } = this.props;
    const { showContacts } = this.state;

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
              style={styles.segmentControl}
              values={SEGMENT_DATA}
              selectedIndex={0}
              onValueChange={::this.onShowContactsListSwitch}
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
          {showContacts ? (
            <CustomerContactsList
              ref={ref => this.$list = ref}
            />
          ) : (
            <ContactGroupsList
              ref={ref => this.$list = ref}
            />
          )}
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

  segmentControl: {
    width: 165,
  },
});