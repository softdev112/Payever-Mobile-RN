import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, Text, View } from 'ui';
import type { Navigator } from 'react-native-navigation';

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
    navigator: Navigator;
  };

  state: {
    conversationSettings: ConversationSettingsData;
  };

  constructor(props) {
    super(props);

    const { messengerInfo, selectedConversationId } = this.props.communication;
    const conversationInfo = messengerInfo.byId(selectedConversationId);

    this.state = {
      conversationSettings: {
        notification: conversationInfo.notification,
      },
    };
  }

  onSavePress() {
    this.props.navigator.pop({ animated: true });
  }

  render() {
    const { messengerInfo, selectedConversationId } = this.props.communication;
    const conversationInfo = messengerInfo.byId(selectedConversationId);
    const { conversationSettings } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Conversation Settings" />
          <NavBar.Button title="Save" onPress={::this.onSavePress} />
        </NavBar>
        <View style={styles.userInfo}>
          <Avatar style={styles.avatar} avatar={conversationInfo.avatar} />
          <Text style={styles.name}>{conversationInfo.name}</Text>
        </View>
        <View style={styles.settings}>
          <CheckBoxPref
            settings={conversationSettings}
            prefName="notification"
            title="Notifications"
            icon="fa-bell-o"
          />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
  },
});

type ConversationSettingsData = {
  notification: boolean;
};