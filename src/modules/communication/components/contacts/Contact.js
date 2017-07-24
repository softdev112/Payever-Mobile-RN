import { Component, PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { inject, observer, Observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet, Text, View } from 'ui';

import OnlineStatus from '../OnlineStatus';
import CountBadge from './CountBadge';
import Avatar from './Avatar';
import type ConversationInfo from
  '../../../../store/communication/models/ConversationInfo';
import type Message from '../../../../store/communication/models/Message';
import type CommunicationStore
  from '../../../../store/communication';
import type UIStore from '../../../../store/ui';

@inject('communication', 'ui')
@observer
export default class Contact extends Component {
  static defaultProps = {
    selected: false,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication?: CommunicationStore;
    item: ConversationInfo | Message;
    selected?: boolean;
    onSelected: () => {};
    ui: UIStore;
  };

  onContactSelect(item: ConversationInfo | Message) {
    const { communication, ui, onSelected } = this.props;
    const { navigator } = this.context;
    const conversationId = item.conversation ? item.conversation.id : item.id;
    communication.setSelectedConversationId(conversationId);

    if (onSelected) {
      onSelected(item);
    }

    // If not tablet mode go to separate Chat Screen
    if (!ui.phoneMode) return;

    communication.chatMessagesState.forwardState();
    navigator.push({ screen: 'communication.Chat' });
  }

  preprocessLatestMsgText(messageText) {
    if (messageText === '') return '';

    if (messageText.includes('[offer_id=')) {
      return 'Personal Offer!';
    }

    return messageText;
  }

  renderContact(item: ConversationInfo) {
    const style = this.props.selected ? styles.current : null;
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
          <Text
            style={styles.latestMessageText}
            numberOfLines={1}
          >
            {latestMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderGroup(item: ConversationInfo) {
    const style = this.props.selected ? styles.current : null;
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
            <Icon
              style={styles.groupTypeIcon}
              source={item.type === 'chat-group'
                ? 'icon-settings-16' : 'icon-pencil-24'}
            />
          </View>
          <Text
            style={styles.latestMessageText}
            numberOfLines={1}
          >
            {latestMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderMessage(item: Message) {
    const name = item.own ? 'You' : item.senderName.split(' ')[0];
    const text = item.editBody.replace(/\s+/g, ' ');

    const style = this.props.selected ? styles.current : null;

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
    const { item } = this.props;

    if (item.type === undefined) {
      return this.renderMessage(item);
    }

    if (item.isGroup) {
      return this.renderGroup(item);
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
    paddingLeft: 8,
    justifyContent: 'space-around',
  },

  nameAndStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  nameBadgeGroup: {
    flex: 1,
    flexDirection: 'row',
  },

  groupTypeIcon: {
    fontSize: 16,
    color: '$pe_color_icon',
  },

  title: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },

  latestMessageText: {
    color: '$pe_color_gray_2',
  },
});