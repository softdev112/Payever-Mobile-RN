/**
 * Created by Elf on 24.03.17.
 */
import { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import { FlatList, TouchableOpacity } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import {
  BottomDock, Loader, MoveYAnimElement, StyleSheet, Text, TextButton, View,
} from 'ui';

import Search from './Search';
import ContactPreview from './ContactPreview';
import AddedContact from './AddedContact';
import Contact from '../../../../store/communication/models/Contact';
import type CommunicationStore
  from '../../../../store/communication';
import type ProfilesStore
  from '../../../../store/profiles';

@inject('communication', 'profiles')
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
    style?: Object;
    bottomDockStyle?: Object;
  };

  context: {
    navigator: Navigator;
  };

  state: {
    showAddContactAnim: boolean;
    contactForAdd: Contact;
  };

  constructor(props) {
    super(props);

    this.state = {
      showForwardAnim: false,
      contactForAdd: null,
    };
  }

  componentWillUnmount() {
    const { communication } = this.props;

    communication.clearAddForActionContacts();
    communication.clearAtocomleteContactsSearch();
  }

  onAddContact() {
    const { communication } = this.props;
    communication.addContactForAction(this.state.contactForAdd);
    this.setState({ showAddContactAnim: false });
  }

  onContactBtnPress({ nativeEvent: { pageY } }, contact) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForAction(contact.id);

    if (isContactAdded) {
      this.onRemoveContactFromAdded(contact.id);
    } else {
      this.setState({
        showAddContactAnim: true,
        startPosY: pageY,
        contactForAdd: contact,
      });
    }
  }

  onRemoveContactFromAdded(contactId) {
    const { communication } = this.props;
    communication.removeContactForAction(contactId);
  }

  onShowContactList() {
    const { navigator } = this.context;

    navigator.push({
      screen: 'communication.AddContactToGroup',
      animated: true,
    });
  }

  onSearchContacts(query) {
    if (query === '') return;
    this.props.communication.searchContactsAutocomplete(query);
  }

  renderContactForAddToGroup(contact) {
    return <AddedContact contact={contact} key={contact.id} />;
  }

  renderItem({ item: contact }) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForAction(contact.id);

    return (
      <View style={styles.listRow} key={contact.id}>
        <ContactPreview contact={contact} />
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={(e) => this.onContactBtnPress(e, contact)}
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
    const { communication, style, bottomDockStyle, profiles } = this.props;
    const { contactForAdd, showAddContactAnim, startPosY } = this.state;

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
        />
        <Loader isLoading={communication.isLoading}>
          <FlatList
            data={communication.contactsAutocomplete.slice()}
            renderRow={::this.renderItem}
            ItemSeparatorComponent={::this.renderSeparator}
            keyboardShouldPersistTaps="always"
            keyExtractor={contact => contact.id}
          />
        </Loader>

        {showAddContactAnim && (
          <MoveYAnimElement
            startPosY={startPosY}
            message={contactForAdd ? contactForAdd.name : ''}
            onAnimationEnd={::this.onAddContact}
          />
        )}

        {communication.isContactsForActionAvailable && (
          <BottomDock
            style={[styles.bottomDock, bottomDockStyle]}
            items={communication.contactsForAction.slice()}
            renderItem={::this.renderContactForAddToGroup}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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

  bottomDock: {
    $topHeight: '52%',
    top: '$topHeight',
    left: -15,
  },
});