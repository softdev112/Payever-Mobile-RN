import { Component } from 'react';
import { Linking } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Html, Icon, StyleSheet, Text, View } from 'ui';
import { log } from 'utils';
//noinspection JSUnresolvedVariable
import Hyperlink from 'react-native-hyperlink';
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

  onLinkOpen(url) {
    Linking.openURL(url).catch(log.warn);
  }

  renderContent(message: Message) {
    if (message.deleted) {
      return <Text style={styles.message_deleted}>(deleted)</Text>;
    }

    if (message.offer) {
      return <Offer offer={message.offer} />;
    }

    if (message.body.startsWith('<')) {
      return <Html style={styles.message} source={message.body} />;
    }

    return (
      <Hyperlink linkStyle={styles.links} onPress={this.onLinkOpen}>
        <Text style={styles.message}>{message.body}</Text>
      </Hyperlink>
    );
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
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.userName}>{`${message.senderName} `}</Text>
            <Text style={styles.date}>{message.dateFormated}</Text>
          </View>
          {this.renderContent(message)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 50,
  },

  avatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 22,
    width: 32,
  },

  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  userName: {
    color: '$pe_color_dark_gray',
    fontSize: 13,
    fontWeight: '500',
  },

  date: {
    color: '$pe_color_icon',
    fontSize: 11,
    marginLeft: 5,
  },

  message: {
    color: '$pe_color_dark_gray',
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

  links: {
    color: '$pe_color_blue',
  },
});