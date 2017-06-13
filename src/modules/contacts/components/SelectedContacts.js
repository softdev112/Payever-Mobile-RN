import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ScrollView } from 'react-native';
import { BottomOverlay, Icon, StyleSheet, Text, View } from 'ui';
import ContactsStore from '../../../store/contacts';
import CommunicationStore from '../../../store/communication';

@inject('communication', 'contacts')
@observer
export default class SelectedContacts extends Component {
  props: {
    contacts: ContactsStore;
    communication: CommunicationStore;
    style?: Object;
  };

  onRemoveContact(id: number | string) {
    const { communication, contacts } = this.props;

    if (typeof id === 'string') {
      communication.removeContactForAction(id);
    } else {
      contacts.removeContactFromSelected(id);
    }
  }

  onRemoveSelectedContacts() {
    const { communication, contacts } = this.props;
    contacts.clearSelectedContacts();
    communication.clearContactsForAction();
  }

  renderContacts() {
    const { communication, contacts } = this.props;

    const communicationContacts = communication.contactsForAction.slice();
    const userContacts = contacts.selectedContacts.slice();

    return userContacts.concat(communicationContacts)
      .map((contact) => {
        return (
          <View
            style={styles.contactCont}
            key={contact.id}
          >
            <Text style={styles.contactName}>
              {contact.name || `${contact.first_name} ${contact.last_name}`}
            </Text>
            <Icon
              style={styles.delIcon}
              onPress={() => this.onRemoveContact(contact.id)}
              source="icon-trashcan-16"
            />
          </View>
        );
      });
  }

  render() {
    const {
      communication: { contactsForAction },
      contacts: { selectedContacts },
      style,
    } = this.props;

    const contactsCount = contactsForAction.length + selectedContacts.length;
    const contactsText = contactsCount === 1
      ? '1 Contact Selected' : `${contactsCount} Contacts Selected`;

    return (
      <BottomOverlay
        style={style}
        startBottom={-50}
        endBottom={0}
        onRemove={::this.onRemoveSelectedContacts}
      >
        <View style={styles.selectedContactsCont}>
          <Icon
            style={styles.contactsIcon}
            source="icon-add-people-16"
          />
        </View>
        <View style={styles.contactsData}>
          <Text
            style={styles.contactsText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {contactsText}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {this.renderContacts()}
          </ScrollView>
        </View>
      </BottomOverlay>
    );
  }
}

const styles = StyleSheet.create({
  selectedContactsCont: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contactsIcon: {
    color: '$pe_color_gray_7d',
    fontSize: 24,
  },

  contactsData: {
    flex: 1,
    alignSelf: 'stretch',
    borderLeftColor: '$pe_color_blue',
    borderLeftWidth: 1,
    paddingLeft: 6,
  },

  contactsText: {
    fontWeight: '400',
  },

  contactCont: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '$pe_color_dark_gray',
    marginRight: 5,
  },

  contactName: {
    color: '#FFF',
  },

  delIcon: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
  },
});