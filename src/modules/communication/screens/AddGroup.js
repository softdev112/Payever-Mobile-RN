import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Switch } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { FlatTextInput, NavBar, StyleSheet, Text, View } from 'ui';

import AddContactBlock from '../components/contacts/AddContactBlock';
import type CommunicationStore from '../../../store/communication';
import type ContactsStore from '../../../store/contacts';

@inject('communication', 'contacts')
@observer
export default class AddGroup extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    contacts: ContactsStore;
    navigator: Navigator;
  };

  state: {
    isAllowGroupChat: boolean;
    groupName: string;
  };

  $groupNameTextInput: FlatTextInput;

  constructor(props) {
    super(props);

    this.state = {
      isAllowGroupChat: false,
      groupName: '',
    };
  }

  onAllowGroupChatsChange() {
    this.setState({
      isAllowGroupChat: !this.state.isAllowGroupChat,
    });
  }

  onCreateNewGroup() {
    const { communication, navigator } = this.props;
    const { isAllowGroupChat, groupName } = this.state;

    if (groupName === '') {
      this.$groupNameTextInput.shakeElementAndSetFocus();
      return;
    }

    communication.createNewGroup(groupName, isAllowGroupChat);
    navigator.pop({ animated: true });
  }


  render() {
    const { communication, contacts } = this.props;
    const { isAllowGroupChat } = this.state;

    const addedContactsCount = communication.contactsForAction.length +
      contacts.selectedContacts.length;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />

          <NavBar.ComplexTitle>
            <View style={styles.header}>
              <Text style={styles.headerMainText}>New Group</Text>
              <Text>
                {`${addedContactsCount} contacts selected`}
              </Text>
            </View>
          </NavBar.ComplexTitle>

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
          <AddContactBlock />
        </View>
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
    paddingTop: 15,
    paddingHorizontal: 15,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerMainText: {
    borderColor: '#FFF',
    fontSize: 16,
    fontWeight: '400',
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
});