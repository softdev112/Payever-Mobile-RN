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

    return (
      <View style={styles.container}>
        <Text style={styles.userName} numberOfLines={1}>
          {conversation.name}
        </Text>
        {conversation.isGroup ? (
          <Text style={styles.membersCountText}>
            {`members: ${conversation.membersCount} ` +
             `online: ${conversation.membersOnlineCount}`}
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
    color: '$pe_color_black',
    fontSize: 15,
    fontWeight: '400',
    maxWidth: '60%',
  },

  membersCountText: {
    fontSize: 12,
  },
});