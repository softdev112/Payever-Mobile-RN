import { Component } from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import moment from 'moment';
import { Icon, StyleSheet, TextButton, Text } from 'ui';

import Avatar from '../contacts/Avatar';
import CommunicationStore from '../../../../store/communication';

// Message lifetime sec
const MESSAGE_LIFETIME = 60000;

@inject('communication')
@observer
export default class SendingMessage extends Component {
  props: {
    communication: CommunicationStore;
    message: any;
    style?: Object;
  };

  state: {
    dotsCount: number;
  };

  dotsTimer: Object;

  constructor(props) {
    super(props);

    this.state = {
      sendTimeExpired: this.isSendTimeExpired(),
      dotsCount: 0,
    };
  }

  componentDidMount() {
    const { sendTimeExpired } = this.state;

    if (!sendTimeExpired) {
      this.dotsTimer = setInterval(() => {
        const { dotsCount } = this.state;
        const timeExpired = this.isSendTimeExpired();

        if (timeExpired) {
          clearInterval(this.dotsTimer);
          this.dotsTimer = null;
          this.setState({ sendTimeExpired: timeExpired });
        } else {
          this.setState({
            sendTimeExpired: timeExpired,
            dotsCount: dotsCount === 4 ? 0 : dotsCount + 1,
          });
        }
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.dotsTimer) {
      clearInterval(this.dotsTimer);
      this.dotsTimer = null;
    }
  }

  onSendAgain() {
    const { communication, message } = this.props;
    const { selectedConversation } = communication;
    selectedConversation.removeMessage(message.id);
    communication.sendMessage(selectedConversation.id, message.body);
  }

  onDelete() {
    const { communication, message } = this.props;
    const { selectedConversation } = communication;
    selectedConversation.removeMessage(message.id);
  }

  isSendTimeExpired() {
    const { message } = this.props;
    const sendTimeExpired = moment(Date.now() - MESSAGE_LIFETIME)
      .isAfter(message.date);

    return sendTimeExpired;
  }

  render() {
    const { message, style } = this.props;
    const { dotsCount, sendTimeExpired } = this.state;

    return (
      <View style={[styles.container, style]}>
        <Avatar
          style={styles.avatar}
          avatar={message.messengerUser.avatar}
        />
        <View style={styles.message}>
          <View style={styles.header}>
            <Text style={styles.headerSender}>
              {message.messengerUser.name}
              <Text style={styles.headerDate}>
                {moment(message.date).format(' MMMM Do YYYY, h:mm:ss a')}
              </Text>
              {!sendTimeExpired && `  Sending${'.'.repeat(dotsCount)}`}
            </Text>
          </View>
          <View style={styles.body}>
            <Text>{message.body}</Text>
          </View>
          {sendTimeExpired && (
            <View style={styles.undelivered}>
              <View style={styles.undeliveredIconCont}>
                <Icon style={styles.undeliveredIcon} source="icon-alert-32" />
                <Text style={styles.undeliveredText}>Undelivered</Text>
              </View>

              <View style={styles.btnCont}>
                <TextButton
                  onPress={::this.onSendAgain}
                  title="Resend"
                  titleStyle={styles.btn}
                />
                <TextButton
                  onPress={::this.onDelete}
                  title="Delete"
                  titleStyle={styles.btn}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    paddingBottom: 8,
    transform: [{ scaleY: -1 }],
  },

  avatar: {
    marginRight: 22,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  headerSender: {
    color: '$pe_color_dark_gray',
    fontSize: 13,
    fontWeight: '500',
  },

  headerDate: {
    color: '$pe_color_icon',
    fontSize: 11,
    marginLeft: 5,
  },

  message: {
    flex: 1,
  },

  sendingText: {
    marginTop: 5,
    textAlign: 'center',
  },

  undelivered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  undeliveredIconCont: {
    flexDirection: 'row',
  },

  undeliveredIcon: {
    color: 'red',
    fontSize: 16,
  },

  undeliveredText: {
    marginLeft: 8,
  },

  btnCont: {
    flexDirection: 'row',
  },

  btn: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
});