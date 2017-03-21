import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListView, Switch, TouchableOpacity } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import {
  BottomDock, FlatTextInput, Loader, MoveYAnimElement, NavBar,
  StyleSheet, Text, View,
} from 'ui';

import Search from '../components/contacts/Search';
import ContactPreview from '../components/contacts/ContactPreview';
import AddedContact from '../components/contacts/AddedContact';
import Contact from '../../../store/communication/models/Contact';
import type CommunicationStore
  from '../../../store/communication';

@inject('communication')
@observer
export default class AddGroup extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  state: {
    showAddContactAnim: boolean;
    contactForAdd: Contact;
    isAllowGroupChat: boolean;
    groupName: string;
  };

  $groupNameTextInput: FlatTextInput;

  constructor(props) {
    super(props);

    this.state = {
      showForwardAnim: false,
      isAllowGroupChat: false,
      contactForAdd: null,
      groupName: '',
    };
  }

  componentWillUnmount() {
    const { communication } = this.props;

    communication.clearAddForGroupContacts();
    communication.clearAtocomleteContactsSearch();
  }

  onAllowGroupChatsChange() {
    this.setState({
      isAllowGroupChat: !this.state.isAllowGroupChat,
    });
  }

  onAddContact() {
    const { communication } = this.props;
    communication.addContactForGroup(this.state.contactForAdd);
    this.setState({ showAddContactAnim: false });
  }

  onContactBtnPress({ nativeEvent: { pageY } }, contact) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForGroup(contact.id);

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
    communication.removeContactForGroup(contactId);
  }

  onShowContactList() {
    const { navigator } = this.props;

    navigator.push({
      screen: 'communication.AddContactToGroup',
      animated: true,
    });
  }

  onCreateNewGroup() {
    const { communication, navigator } = this.props;
    const { isAllowGroupChat, groupName } = this.state;

    if (groupName === '') {
      this.$groupNameTextInput.shakeElementAndSetFoucs();
      return;
    }

    communication.createNewGroup(groupName, isAllowGroupChat);
    navigator.pop({ animated: true });
  }

  onSearchContacts(query) {
    if (query === '') return;
    this.props.communication.searchContactsAutocomplete(query);
  }

  renderContactForAddToGroup(contact) {
    return <AddedContact contact={contact} key={contact.id} />;
  }

  renderRow(contact) {
    const { communication } = this.props;
    const isContactAdded = communication.checkContactAddedForGroup(contact.id);

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

  renderSeparator(_, rowId) {
    return <View key={rowId} style={styles.smallDivider} />;
  }

  render() {
    const { communication } = this.props;
    const {
      contactForAdd, showAddContactAnim, startPosY, isAllowGroupChat,
    } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Create New Group" />
          <NavBar.Button title="Save" onPress={::this.onCreateNewGroup} />
        </NavBar>
        <View style={styles.formContent}>
          <FlatTextInput
            ref={ref => this.$groupNameTextInput = ref}
            placeholder="Name You Group"
            onChangeText={text => this.setState({ groupName: text })}
            value={this.state.groupName}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchTitleText}>Allow group chats</Text>
            <Switch
              value={isAllowGroupChat}
              onValueChange={::this.onAllowGroupChatsChange}
            />
          </View>
          <TouchableOpacity
            style={styles.addFromContactsBtn}
            onPress={::this.onShowContactList}
          >
            <Text style={styles.addFromContactsBtnText}>
              Add Contacts
            </Text>
          </TouchableOpacity>
          <Search
            style={styles.search}
            showSettings={false}
            onSearchAction={::this.onSearchContacts}
          />
          <Loader isLoading={communication.isLoading}>
            <ListView
              dataSource={communication.contactsAutocompDataSource}
              enableEmptySections
              renderRow={::this.renderRow}
              renderSeparator={::this.renderSeparator}
              keyboardShouldPersistTaps="always"
            />
          </Loader>
        </View>

        {showAddContactAnim && (
          <MoveYAnimElement
            startPosY={startPosY}
            message={contactForAdd ? contactForAdd.name : ''}
            onAnimationEnd={::this.onAddContact}
          />
        )}

        {communication.isContactsForGroupAvailable && (
          <BottomDock
            style={styles.bottomDock}
            items={communication.contactsForGroup.slice()}
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
  },

  formContent: {
    flex: 1,
    padding: 15,
  },

  switchRow: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchTitleText: {
    fontSize: 18,
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

  addFromContactsBtn: {
    alignSelf: 'stretch',
    marginBottom: 14,
  },

  addFromContactsBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: '$pe_color_blue',
  },

  bottomDock: {
    $maxTopHeight: '94%',
    top: '$maxTopHeight - 60',
  },
});