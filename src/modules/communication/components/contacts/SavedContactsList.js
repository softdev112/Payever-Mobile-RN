import { Component } from 'react';
import { ListView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, StyleSheet, View } from 'ui';

import SavedContactView from './SavedContactView';
import type ProfilesStore from '../../../../store/profiles';
import type SavedContact from '../../../../store/profiles/models/SavedContact';

import type CommunicationStore from '../../../../store/communication';
import type Contact from '../../../../store/communication/models/Contact';

@inject('communication', 'profiles')
@observer
export default class SavedContactsList extends Component {
  props: {
    communication: CommunicationStore;
    profiles: ProfilesStore;
    style?: Object | number;
  };

  state: {
    selectedContacts: Array<Contact>;
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedContacts: props.communication.contactsForGroup.slice(),
    };
  }

  async componentWillMount() {
    const { profiles } = this.props;

    await profiles.loadAllContacts();
  }

  onSelectedContactChange(contact) {
    const isSelected = this.isContactSelected();

    if (isSelected) {
      this.removeContactFromSelected(contact.id);
    } else {
      this.addContactToSelected(contact);
    }
  }

  async addContactToSelected(contact) {
    if (this.isContactSelected()) return;

    const { communication } = this.props;
    const { selectedContacts } = this.state;

    // Prepare contact for adding to group
    const contactData = await communication.getContactData(contact.id);
    const contactForAdd = this.getContactForAdding(contact, contactData);

    this.setState({
      selectedContacts: selectedContacts.concat(contactForAdd),
    });
  }

  isContactSelected(contactId) {
    const { selectedContacts } = this.state;

    return !!selectedContacts.find(contact =>
      contact.id === contactId || contact.savedId === contactId);
  }

  getContactForAdding(contact: SavedContact, contactData: Object): ?Contact {
    if (!contact || !contactData) return null;

    const { name, user_type } = contactData.messengerUser;
    const { id } = contact;

    let contactId = '';
    switch (user_type) {
      case 'employee': {
        contactId = `employee-${id}`;
        break;
      }

      case 'contact': {
        contactId = `contact-${id}`;
        break;
      }

      default: {
        contactId = `user-${id}`;
        break;
      }
    }

    return Object.assign({}, {
      name,
      id: contactId,
      savedId: contact.id,
      avatar: contactData.avatar,
      email: contact.email,
      blockName: user_type + 's',
    });
  }

  removeContactFromSelected(contactId) {
    const { selectedContacts } = this.state;
    this.setState({
      selectedContacts: selectedContacts.filter(
        contact => contact !== contactId && contact.savedId !== contactId
      ),
    });
  }

  saveSelectedContacts() {
    const { communication } = this.props;
    const { selectedContacts } = this.state;

    selectedContacts.forEach(contact =>
      communication.addContactForGroup(contact));
  }

  renderRow(contact) {
    return (
      <SavedContactView
        contact={contact}
        key={contact.id}
        initValue={this.isContactSelected(contact.id)}
        onSelectedChange={::this.onSelectedContactChange}
      />
    );
  }

  renderSeparator(_, rowId) {
    return <View key={rowId} style={styles.smallDivider} />;
  }

  render() {
    const { profiles, style } = this.props;
    const ds = profiles.allContactsDataSource;

    if (ds.isLoading || ds.error) {
      return (
        <View style={[styles.container, style]}>
          <Loader isLoading={ds.isLoading}>
            <ErrorBox message={ds.error} />
          </Loader>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <ListView
          dataSource={ds}
          enableEmptySections
          keyboardShouldPersistTaps="always"
          renderRow={::this.renderRow}
          renderSeparator={::this.renderSeparator}
        />
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

  savedContactRow: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedRow: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },

  contactBtn: {
    width: 60,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: '$pe_color_blue',
  },
});