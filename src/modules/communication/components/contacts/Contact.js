import { Component, PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { inject, observer, Observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { StyleSheet, Text, View } from 'ui';

import OnlineStatus from '../OnlineStatus';
import CountBadge from './CountBadge';
import Avatar from './Avatar';
import type ConversationInfo from
  '../../../../store/communication/models/ConversationInfo';
import type Message from '../../../../store/communication/models/Message';
import type CommunicationStore
  from '../../../../store/communication';

@inject('communication')
@observer
export default class Contact extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication?: CommunicationStore;
    item: Object;
    phoneView: boolean;
    type: 'contacts' | 'groups' | 'foundMessages';
  };

  onContactSelect(item: ConversationInfo | Message) {
    const { communication, phoneView } = this.props;
    const conversationId = item.conversation ? item.conversation.id : item.id;
    communication.setSelectedConversationId(conversationId);

    if (phoneView) {
      this.context.navigator.push({ screen: 'communication.Chat' });
    }
  }

  preprocessLatestMsgText(messageText) {
    if (messageText === '') return '';

    if (messageText.includes('[offer_id=')) {
      return 'Personal Offer!';
    }

    return messageText;
  }

  renderContact(item: ConversationInfo) {
    const current = this.props.communication.selectedConversationId === item.id;
    const style = current ? styles.current : null;
    const latestMessage = item.latestMessage
      ? this.preprocessLatestMsgText(item.latestMessage.editBody) : '';

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => this.onContactSelect(item)}
      >
        <Avatar avatar={item.avatar} />
        <View style={styles.contactInfo}>
          <View style={styles.nameAndStatusRow}>
            <View style={styles.nameBadgeGroup}>
              <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
              <CountBadge value={item.unreadCount} />
            </View>
            <Observer>
              {() => (<OnlineStatus isOnline={item.status.online} />)}
            </Observer>
          </View>
          <Text numberOfLines={1}>{latestMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderGroup(item: ConversationInfo) {
    const current = this.props.communication.selectedConversationId === item.id;
    const style = current ? styles.current : null;
    const latestMessage = item.latestMessage
      ? this.preprocessLatestMsgText(item.latestMessage.editBody) : '';

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => this.onContactSelect(item)}
      >
        <Avatar avatar={item.avatar} />
        <View style={styles.contactInfo}>
          <View style={styles.nameBadgeGroup}>
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
            <CountBadge value={item.unreadCount} />
          </View>
          <Text numberOfLines={1}>{latestMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderMessage(item: Message) {
    const name = item.own ? 'You' : item.senderName.split(' ')[0];
    const text = item.editBody.replace(/\s+/g, ' ');

    const current = this.props.communication.selectedConversationId === item.id;
    const style = current ? styles.current : null;

    return (
      <TouchableOpacity
        style={[styles.message, style]}
        onPress={() => this.onContactSelect(item)}
      >
        <View style={styles.message_header}>
          <Text style={styles.message_sender} numberOfLines={1}>
            {item.senderName}
          </Text>
          <Text style={styles.message_date}>{item.dateOnly}</Text>
        </View>
        <View style={styles.message_body}>
          <Text style={styles.message_name} numberOfLines={1}>
            {name}:
            <Text style={styles.message_text} source={item.body}> {text}</Text>
          </Text>
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
    paddingVertical: 7,
    minHeight: 60,
  },

  current: {
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
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
    fontSize: 13,
    color: '$pe_color_icon',
  },

  message_header: {
    flexDirection: 'row',
  },

  message_name: {
    color: '$pe_color_blue',
    fontSize: 14,
  },

  message_sender: {
    color: '#9ba2b1',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },

  message_text: {
    color: '#9ba2b1',
    fontSize: 14,
  },

  contactInfo: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },

  nameAndStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  nameBadgeGroup: {
    flexDirection: 'row',
  },

  title: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
});