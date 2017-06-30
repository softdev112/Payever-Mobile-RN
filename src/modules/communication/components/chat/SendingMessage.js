import { Component } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { StyleSheet, Text } from 'ui';

import Avatar from '../contacts/Avatar';
// import CommunicationStore from '../../../../store/communication';

export default class SendingMessage extends Component {
  props: {
   // communication: CommunicationStore;
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
      dotsCount: 0,
    };
  }

  componentDidMount() {
    if (!this.dotsTimer) {
      this.dotsTimer = setInterval(() => {
        const { dotsCount } = this.state;
        if (this.dotsTimer) {
          this.setState({
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

  render() {
    const { message, style } = this.props;
    const { dotsCount } = this.state;

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
              {`  Sending${'.'.repeat(dotsCount)}`}
            </Text>
          </View>
          <View style={styles.body}>
            <Text>{message.body}</Text>
          </View>
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
});