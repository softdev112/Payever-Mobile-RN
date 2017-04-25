import { Component } from 'react';
import { StyleSheet, Text, View } from 'ui';
import { observer, inject } from 'mobx-react/native';
import Status from './Status';
import type CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class Header extends Component {
  props: {
    communication: CommunicationStore;
  };

  render() {
    const { selectedConversation: conversation } = this.props.communication;

    if (!conversation) return null;

    let membersCount = 0;
    let membersOnlineCount = 0;

    if (conversation.isGroup && conversation.settings) {
      membersCount = conversation.settings.members.length;
      membersOnlineCount = conversation.settings.members
        .slice()
        .filter(m => m.status.online).length;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.userName} numberOfLines={1}>
          {conversation.name}
        </Text>
        {conversation.isGroup ? (
          <Text>
            {`Members: ${membersCount}, Online: ${membersOnlineCount}`}
          </Text>
        ) : (
          <Status status={conversation.status} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  userName: {
    color: '$pe_color_dark_gray',
    fontSize: 22,
    fontWeight: '200',
    maxWidth: '60%',
  },
});