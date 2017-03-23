import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, NavBar, StyleSheet, Text, View } from 'ui';

import type CommunicationStore from '../../../store/communication';
import Avatar from '../components/contacts/Avatar';
import CheckBoxPref from '../components/settings/CheckBoxPref';

@inject('communication')
@observer
export default class ConversationSettings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
  };

  componentWillMount() {
    const { communication } = this.props;
    communication.getConversationSettings();
  }

  onConvNotificationPropChange(value) {
    this.props.communication.changeConvNotificationProp(value);
  }

  render() {
    const {
      isLoading,
      error,
      selectedConversationSettings,
    } = this.props.communication;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Conversation Settings" />
        </NavBar>
        <Loader isLoading={isLoading || !selectedConversationSettings}>
          {error || !selectedConversationSettings ? (
            <ErrorBox message={error} />
          ) : (
            <View style={styles.userInfo}>
              <Avatar
                style={styles.avatar}
                lettersStyle={styles.avatarLetters}
                avatar={selectedConversationSettings.avatar}
              />
              <Text style={styles.name}>
                {selectedConversationSettings.name}
              </Text>
              <CheckBoxPref
                initValue={selectedConversationSettings.notification}
                title="Notifications"
                icon="fa-bell-o"
                onValueChange={::this.onConvNotificationPropChange}
              />
            </View>
          )}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  settings: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  },

  userInfo: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  avatar: {
    width: 70,
    height: 70,
    marginBottom: 10,
    marginRight: 0,
  },

  avatarLetters: {
    fontSize: 34,
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 20,
  },
});