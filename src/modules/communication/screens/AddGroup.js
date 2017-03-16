import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListView, Switch } from 'react-native';
import {
  FlatTextInput, Loader, NavBar, StyleSheet, Text, View,
} from 'ui';

import Search from '../components/contacts/Search';
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
  };

  onAddGroup() {
    console.log('sssssssssssssssssss save');
  }

  onSearchContacts(query) {
    if (query === '') return;

    this.props.communication.searchContactsAutocomplete(query);
  }

  renderRow(contact) {
    return (
      <View
        style={styles.listRow}
        key={contact.id}
      >
        <Text>{contact.name}</Text>
      </View>
    );
  }

  renderSeparator(secId, rowId) {
    return <View key={rowId} style={styles.smallDivider} />;
  }

  render() {
    const { communication } = this.props;
    const ds = communication.contactsAutocompDataSource;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Create New Group" />
          <NavBar.Button title="Save" onPress={this.onAddGroup} />
        </NavBar>
        <View style={styles.formContent}>
          <FlatTextInput
            placeholder="Name You Group"
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchTitleText}>Allow group chats</Text>
            <Switch />
          </View>
          <Search
            showSettings={false}
            onSearchAction={::this.onSearchContacts}
          />
          <Loader isLoading={communication.isLoading}>
            <ListView
              dataSource={ds}
              enableEmptySections
              contentContainerStyle={styles.contactsContainer}
              renderRow={::this.renderRow}
              renderSeparator={::this.renderSeparator}
            />
          </Loader>
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
    padding: 15,
  },

  switchRow: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  switchTitleText: {
    fontSize: 16,
  },

  contactsContainer: {
  },

  smallDivider: {
    height: 1,
    backgroundColor: '$pe_color_apple_div',
  },

  listRow: {
    height: 50,
  },
});