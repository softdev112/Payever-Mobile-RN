import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Html, Icon, StyleSheet, Text, View } from 'ui';
import type Message from '../../../../store/CommunicationStore/models/Message';
import { Config } from '../../../../config';
import Offer from './OfferView';

@inject('config')
@observer
// eslint-disable-next-line react/prefer-stateless-function
export default class MessageView extends Component {
  props: {
    config?: Config;
    message: Message;
  };

  renderContent(message: Message) {
    if (message.deleted) {
      return <Text style={styles.message_deleted}>(deleted)</Text>;
    }

    if (message.offer) {
      return <Offer offer={message.offer} />;
    }

    return <Html source={message.body} />;
  }

  render() {
    const message: Message = this.props.message;

    let avatar = message.avatar.valueRetina || message.avatar.value;
    if (!avatar.startsWith('http')) {
      avatar = this.props.config.siteUrl + avatar;
    }

    return (
      <View style={styles.container}>
        <Icon style={styles.avatar} source={{ uri: avatar }} />
        <View style={styles.message}>
          <View style={styles.header}>
            <Text style={styles.header_sender}>{`${message.senderName} `}</Text>
            <Text style={styles.header_date}>{message.dateFormated}</Text>
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
});