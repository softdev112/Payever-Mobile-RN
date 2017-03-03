import { Component } from 'react';
import { Html, Icon, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import type Message from '../../../../store/CommunicationStore/models/Message';
import Offer from '../../../marketing/components/OfferDetails';
import MediaView from './MediaView';
import type CommunicationStore from '../../../../store/CommunicationStore';

@inject('communication')
@observer
export default class MessageView extends Component {
  props: {
    communication: CommunicationStore;
    message: Message;
  };

  renderContent(message: Message) {
    if (message.deleted) {
      return <Text style={styles.message_deleted}>(deleted)</Text>;
    }

    if (message.offer) {
      return <Offer offer={message.offer} />;
    }

    if (message.medias && message.medias.length) {
      return message.medias.map(media => (
        <MediaView key={media.url} media={media} />
      ));
    }

    return <Html source={message.body} />;
  }

  renderAvatar(avatar) {
    if (avatar.type === 'url') {
      const avatarUrl = avatar.valueRetina || avatar.value;
      return (
        <Icon style={styles.avatar} source={{ uri: avatarUrl }} />
      );
    }

    if (avatar.type === 'letters') {
      return (
        <View style={styles.avatar_letters}>
          <Text style={styles.avatar_text}>{avatar.value}</Text>
        </View>
      );
    }

    return null;
  }

  render() {
    const message: Message = this.props.message;
    const communication: CommunicationStore = this.props.communication;

    const isSeen = !message.opponentUnread
      && communication.messengerInfo.messengerUser.id === message.senderId;

    if (message.isSystem) {
      return (
        <View style={styles.container}>
          <Text style={styles.message_system}>{message.body}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderAvatar(message.avatar)}
        <View style={styles.message}>
          <View style={styles.header}>
            <Text style={styles.header_sender}>{`${message.senderName} `}</Text>
            <Text style={styles.header_date}>{message.dateFormated}</Text>
            {isSeen && (
              <Text style={styles.header_date}>seen</Text>
            )}
          </View>
          <View style={styles.body}>
            {this.renderContent(message)}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 22,
    width: 32,
  },

  avatar_letters: {
    alignItems: 'center',
    borderColor: '#666',
    borderRadius: 16,
    borderWidth: 1,

    height: 32,
    justifyContent: 'center',
    marginRight: 22,
    width: 32,
  },

  avatar_text: {
    fontSize: 16,
  },

  body: {
    overflow: 'scroll',
  },

  container: {
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 50,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  header_sender: {
    color: '$pe_color_dark_gray',
    fontSize: 13,
    fontWeight: '500',
  },

  header_date: {
    color: '$pe_color_icon',
    fontSize: 11,
    marginLeft: 5,
  },

  links: {
    color: '$pe_color_blue',
  },

  message: {
    flex: 1,
  },

  message_text: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 13,
    fontWeight: '200',
    marginTop: 2,
  },

  message_deleted: {
    color: '$pe_color_icon',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  message_system: {
    alignSelf: 'flex-start',
    backgroundColor: '$border_color',
    borderRadius: 18,
    marginVertical: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});