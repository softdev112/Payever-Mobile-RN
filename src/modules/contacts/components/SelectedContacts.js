import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
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

  onRemoveSelectedContacts() {
    const { contacts } = this.props;
    contacts.clearSelectedContacts();
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
});