import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { FlatList, TouchableOpacity } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { Loader, StyleSheet, Text, TextButton, View } from 'ui';

import Search from './Search';
import ContactPreview from './ContactPreview';
import Contact from '../../../../store/communication/models/Contact';
import type CommunicationStore
  from '../../../../store/communication';
import type ProfilesStore
  from '../../../../store/profiles';
import type ContactsStore
  from '../../../../store/contacts';

@inject('communication', 'profiles', 'contacts')
@observer
export default class AddContactBlock extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    communication: CommunicationStore;
    profiles: ProfilesStore;
    contacts: ContactsStore;
    style?: Object;
  };

  context: {
    navigator: Navigator;
  };

  componentWillUnmount() {
    const { communication } = this.props;
    communication.clearAtocomleteContactsSearch();
  }

  onContactBtnPress(contact: Contact) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForAction(contact.id);

    if (isContactAdded) {
      this.onRemoveContactFromAdded(contact.id);
    } else {
      this.onAddContact(contact);
    }

    // For rerendering row when contacts adds
    this.setState({});
  }

  onAddContact(contact: Contact) {
    const { communication } = this.props;
    communication.addContactForAction(contact);
  }

  onRemoveContactFromAdded(contactId) {
    const { communication } = this.props;
    communication.removeContactForAction(contactId);
  }

  onShowContactList() {
    const { navigator } = this.context;
    const { contacts } = this.props;

    contacts.ui.setSelectMode(true);
    navigator.push({
      screen: 'contacts.BusinessContacts',
      animated: true,
    });
  }

  async onSearchContacts(query) {
    if (query === '') return;
    await this.props.communication.searchContactsAutocomplete(query);
  }

  renderItem({ item: contact }) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForAction(contact.id);

    return (
      <View style={styles.listRow}>
        <ContactPreview contact={contact} />
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => this.onContactBtnPress(contact)}
        >
          <Text style={styles.contactBtnText}>
            {isContactAdded ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSeparator() {
    return <View style={styles.smallDivider} />;
  }

  render() {
    const { communication, contacts, style, profiles } = this.props;
    const isContactsSelected = contacts.selectedContacts.length > 0
      || communication.contactsForAction.length > 0;

    return (
      <View style={[styles.container, style]}>
        {profiles.currentProfile.isBusiness && (
          <TextButton
            style={styles.addContactsBtn}
            title="Add From Contacts"
            onPress={::this.onShowContactList}
          />
        )}
        <Search
          style={styles.search}
          showSettings={false}
          onSearchAction={::this.onSearchContacts}
          localState
        />
        <Loader isLoading={communication.isLoading}>
          <FlatList
            data={communication.contactsAutocomplete.slice()}
            renderItem={::this.renderItem}
            ItemSeparatorComponent={::this.renderSeparator}
            keyboardShouldPersistTaps="always"
            keyExtractor={contact => contact.id}
            contentInset={{ bottom: isContactsSelected ? 50 : 10 }}
          />
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  smallDivider: {
    height: 1,
    backgroundColor: '$pe_color_apple_div',
  },

  search: {
    marginBottom: 5,
  },

  listRow: {
    flexDirection: 'row',
  },

  contactBtn: {
    width: 65,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: '$pe_color_blue',
  },

  addContactsBtn: {
    marginBottom: 14,
  },
});