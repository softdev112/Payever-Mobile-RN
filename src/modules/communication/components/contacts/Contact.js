import { Component, PropTypes } from 'react';
import { TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { StyleSheet, Text } from 'ui';

import OnlineStatus from '../OnlineStatus';
import Conversation from
  '../../../../store/CommunicationStore/models/ConversationInfo';
import Group from '../../../../store/CommunicationStore/models/Group';

export default class Contact extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    item: Object;
    type: 'contacts' | 'groups';
  };

  onContactClick(item) {
    this.context.navigator.push({
      screen: 'communication.Chat',
      passProps: {
        conversationId: item.id,
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

  render() {
    const { item, type } = this.props;
    if (type === 'groups') {
      return this.renderGroup(item);
    }
    return this.renderContact(item);
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  add: {
    color: '$pe_color_icon',
    fontSize: 16,
    height: 17,
    width: 16,
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