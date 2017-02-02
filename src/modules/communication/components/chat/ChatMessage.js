import { Component } from 'react';
import { Linking } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, Text, View } from 'ui';
import { log } from 'utils';
//noinspection JSUnresolvedVariable
import Hyperlink from 'react-native-hyperlink';
import type Message from '../../../../store/CommunicationStore/models/Message';
import { Config } from '../../../../config';

@inject('config')
@observer
// eslint-disable-next-line react/prefer-stateless-function
export default class ChatMessage extends Component {
  props: {
    config?: Config;
    message: Message;
  };

  onLinkOpen(url) {
    Linking.openURL(url).catch(log.warn);
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
          <Hyperlink
            linkStyle={styles.links}
            onPress={url => Linking.openURL(url)}
          >
            <Text style={styles.message}>{message.body}</Text>
          </Hyperlink>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    color: '$pe_icons_color',
    fontSize: 11,
    marginLeft: 5,
  },

  message: {
    color: '$pe_color_dark_gray',
    fontSize: 13,
    fontWeight: '200',
    marginTop: 2,
  },

  links: {
    color: '$pe_color_blue',
  },
});