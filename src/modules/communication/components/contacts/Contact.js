import { Component, PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { StyleSheet, Text, View } from 'ui';

import OnlineStatus from '../OnlineStatus';
import Conversation from
  '../../../../store/CommunicationStore/models/ConversationInfo';
import Group from '../../../../store/CommunicationStore/models/Group';
import Message from '../../../../store/CommunicationStore/models/Message';

export default class Contact extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    item: Object;
    type: 'contacts' | 'groups' | 'foundMessages';
  };

  onContactClick(item: Conversation | Group | Message) {
    console.log('TYPE', item.type);
    const conversationId = item.conversation ? item.conversation.id : item.id;

    this.context.navigator.push({
      screen: 'communication.Chat',
      passProps: {
        conversationId,
        isGroup: item.type && item.type.indexOf('group') !== -1,
      },
    });
  }

  renderContact(item: Conversation) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onContactClick(item)}
      >
        <OnlineStatus
          style={styles.status}
          isOnline={item.status.online}
        />
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderGroup(item: Group) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.onContactClick(item)}
      >
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderMessage(item: Message) {
    const name = item.own ? 'You' : item.senderName.split(' ')[0];
    const text = item.editBody.replace(/\s+/g, ' ');

    return (
      <TouchableOpacity
        style={styles.message}
        onPress={() => this.onContactClick(item)}
      >
        <View style={styles.message_header}>
          <Text style={styles.message_sender} numberOfLines={1}>
            {item.senderName}
          </Text>
          <Text style={styles.message_date}>{item.dateOnly}</Text>
        </View>
        <View style={styles.message_body}>
          <Text style={styles.message_name} numberOfLines={1}>{name}</Text>
          <Text style={styles.message_text} source={item.body}>: {text}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { item, type } = this.props;
    if (type === 'groups') {
      return this.renderGroup(item);
    }

    if (type === 'foundMessages') {
      return this.renderMessage(item);
    }

    return this.renderContact(item);
  }
}

const styles = StyleSheet.create({
  add: {
    color: '$pe_color_icon',
    fontSize: 16,
    height: 17,
    width: 16,
  },

  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  message: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  message_body: {
    flexDirection: 'row',
    marginTop: 4,
  },

  message_date: {
    fontSize: 11,
    color: '$pe_color_icon',
  },

  message_header: {
    flexDirection: 'row',
  },

  message_name: {
    color: '$pe_color_blue',
    fontSize: 12,
  },

  message_sender: {
    color: '#9ba2b1',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },

  message_text: {
    color: '#9ba2b1',
    fontSize: 12,
  },

  status: {
    marginRight: 9,
  },

  title: {
    color: '#9ba2b1',
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
  },
});