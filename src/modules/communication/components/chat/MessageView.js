import { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react/native';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { Html, RoundSwitch, StyleSheet, Text, View } from 'ui';

import MediaView from './MediaView';
import Avatar from '../contacts/Avatar';
import type Message from '../../../../store/communication/models/Message';
import Offer from '../../../marketing/components/OfferDetails';
import CommunicationStore from '../../../../store/communication';

const SWITCH_INIT_Y_POS = -40;

@inject('communication')
@observer
export default class MessageView extends Component {
  static defaultProps = {
    selectMode: false,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    message: Message;
    communication: CommunicationStore;
    selectMode?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    onSelectPress?: () => void;
  };

  context: {
    navigator: Navigator;
  };

  state: {
    paddingAnimValue: Animated.Value;
    leftPosAnimValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      paddingAnimValue: new Animated.Value(0),
      leftPosAnimValue: new Animated.Value(SWITCH_INIT_Y_POS),
    };
  }

  componentDidMount() {
    const { selectMode } = this.props.communication;

    if (selectMode) {
      this.onSelectModeOn();
    }
  }

  componentWillReceiveProps(newProps) {
    const { selectMode } = this.props.communication;

    if (!selectMode && newProps.communication.selectMode) {
      this.onSelectModeOn();
    } else if (selectMode && !newProps.communication.selectMode) {
      this.onSelectedModeOff();
    }
  }

  onSelectModeOn() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 40,
        duration: 250,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: 5,
        duration: 400,
      }),
    ]).start();
  }

  onSelectedModeOff() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 4,
        duration: 400,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: SWITCH_INIT_Y_POS,
        duration: 250,
      }),
    ]).start();
  }

  onMessagePress({ nativeEvent }) {
    const { onPress } = this.props;

    if (onPress) {
      onPress(nativeEvent);
    }
  }

  onMessageLongPress({ nativeEvent }) {
    const { message, onLongPress } = this.props;

    if (onLongPress) {
      onLongPress(nativeEvent, message);
    }
  }

  onSelectValueChange() {
    const { onSelectPress } = this.props;

    if (onSelectPress) {
      onSelectPress();
    }
  }

  renderContent(message: Message) {
    if (message.deleted) {
      return <Text style={styles.messageDeleted}>(deleted)</Text>;
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

  render() {
    const { message } = this.props;
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    if (message.isSystem) {
      return (
        <View style={styles.container}>
          <Text style={styles.messageSystem}>{message.body}</Text>
        </View>
      );
    }

    const { forwardFrom, replyTo } = message;
    const msgHeader = forwardFrom
      ? `Forwarded From ${forwardFrom.senderName} ` : `${message.senderName} `;
    const messageEdited = message.edited ? '(edited)' : '';
    const messageSeen = message.unread ? '' : 'Seen';

    return (
      <TouchableWithoutFeedback
        onLongPress={::this.onMessageLongPress}
        onPress={::this.onMessagePress}
      >
        <Animated.View
          style={[styles.container, { paddingLeft: paddingAnimValue }]}
        >
          <RoundSwitch
            style={[styles.selectSwitch,
            { left: leftPosAnimValue }]}
            onValueChange={::this.onSelectValueChange}
          />
          <Avatar style={styles.avatar} avatar={message.avatar} />
          <View style={styles.message}>
            <View style={styles.header}>
              <Text style={styles.headerSender}>
                {msgHeader}
                <Text style={styles.headerDate}>
                  {message.dateFormated} {messageEdited} {messageSeen}
                </Text>
              </Text>
            </View>
            {replyTo && (
              <View style={styles.replayContainer}>
                <Text style={styles.replySender}>{replyTo.senderName}</Text>
                <Text style={styles.replyBody}>
                  {replyTo.deleted ? 'deleted' : replyTo.body}
                </Text>
              </View>
            )}
            <View style={styles.body}>
              {this.renderContent(message)}
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    padding: 4,
    paddingBottom: 8,
  },

  body: {
    overflow: 'scroll',
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

  links: {
    color: '$pe_color_blue',
  },

  message: {
    flex: 1,
  },

  messageText: {
    color: '$pe_color_dark_gray',
    flex: 1,
    fontSize: 13,
    fontWeight: '200',
    marginTop: 2,
  },

  messageDeleted: {
    color: '$pe_color_icon',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  messageSystem: {
    alignSelf: 'flex-start',
    backgroundColor: '$border_color',
    borderRadius: 18,
    marginVertical: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  replayContainer: {
    borderLeftColor: '$pe_color_dark_gray',
    borderLeftWidth: 1,
    paddingLeft: 10,
    paddingVertical: 2,
    marginVertical: 4,
  },

  replySender: {
    color: '$pe_color_dark_gray',
    fontSize: 11,
    fontWeight: '500',
  },

  replyBody: {
    color: '$pe_color_gray',
    fontSize: 11,
    fontWeight: '200',
  },

  selectSwitch: {
    position: 'absolute',
    top: 8,
    left: SWITCH_INIT_Y_POS,
  },
});