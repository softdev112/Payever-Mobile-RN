import { Component } from 'react';
import { FlatList } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, StyleSheet, Text, View } from 'ui';

import ContactGroup from './ContactGroup';
import type ContactGroupInfo
  from '../../../store/contacts/models/ContactGroupInfo';
import ContactsStore from '../../../store/contacts';

@inject('contacts')
@observer
export default class ContactGroupsList extends Component {
  props: {
    contacts: ContactsStore;
    style?: Object | number;
  };

  onSelectedGroupChange: (
    state: boolean,
    contact: ContactGroupInfo
  ) => void;
  onGroupLongPress: (contact: ContactGroupInfo) => void;

  constructor(props) {
    super(props);

    this.onSelectedGroupChange = this.onSelectedGroupChange.bind(this);
    this.onGroupLongPress = this.onGroupLongPress.bind(this);
  }

  async componentWillMount() {
    const { contacts } = this.props;
    await contacts.loadAllContactGroups();
  }

  async onEndReached() {
    const { contacts } = this.props;
    if (contacts.isLoading) return;
    await contacts.loadAllContactGroups();
  }

  async onSelectedGroupChange(isSelected, group: ContactGroupInfo) {
    const { contacts } = this.props;

    if (isSelected) {
      contacts.addContactsFromGroupToSelected(group.id);
    } else {
      contacts.removeContactsGroupFromSelected(group.id);
    }
  }

  onGroupLongPress(group) {
    const { contacts } = this.props;
    contacts.addContactsFromGroupToSelected(group.id);
    contacts.ui.setSelectMode(true);
  }

  renderItem({ item: group }) {
    const { contacts } = this.props;

    return (
      <ContactGroup
        selectMode={contacts.ui.selectMode}
        selected={false}
        group={group}
        onSelectChange={this.onSelectedGroupChange}
        onLongPress={this.onGroupLongPress}
      />
    );
  }

  renderSeparator() {
    return <View style={styles.smallDivider} />;
  }

  renderFooter() {
    const { contacts } = this.props;

    if (!contacts.isLoading) return null;

    return (
      <View style={styles.footer}>
        <Loader isLoading={contacts.isLoading} />
      </View>
    );
  }

  renderEmptyComponent() {
    return (
      <Text style={styles.noContactsText}>
        There are no contacts available
      </Text>
    );
  }

  render() {
    const { contacts, style } = this.props;

    if (contacts.isLoading || contacts.error) {
      return (
        <View style={[styles.container, style]}>
          <Loader isLoading={contacts.isLoading}>
            <ErrorBox message={contacts.error} />
          </Loader>
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <FlatList
          extraData={[contacts.ui.selectMode]}
          initialNumToRender={20}
          data={contacts.contactGroups.slice()}
          keyboardShouldPersistTaps="always"
          renderItem={::this.renderItem}
          ItemSeparatorComponent={::this.renderSeparator}
          renderFooter={::this.renderFooter}
          onEndReached={::this.onEndReached}
          onEndReachedThreshold={80}
          ListEmptyComponent={::this.renderEmptyComponent}
          keyExtractor={c => c.id}
          contentInset={{ top: 8, bottom: 8 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },

  smallDivider: {
    height: 1,
    backgroundColor: '$pe_color_apple_div',
  },

  footer: {
    paddingVertical: 5,
  },

  noContactsText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 16,
  },
});