import { Component } from 'react';
import { Animated } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, Text, View } from 'ui';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class ReplyMessage extends Component {
  props: {
    communication: CommunicationStore;
    onRemove?: () => void;
  };

  state: {
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, {
      toValue: 50,
      duration: 200,
    }).start();
  }

  onRemoveMsgForReply() {
    const { communication, onRemove } = this.props;

    Animated.timing(this.state.animValue, {
      toValue: 0,
      duration: 200,
    }).start(() => {
      communication.removeMessageForReply();
      if (onRemove) {
        onRemove();
      }
    });
  }

  render() {
    const { messageForReply: message } = this.props.communication;

    return (
      <Animated.View
        style={[styles.container, { bottom: this.state.animValue }]}
      >
        <View style={styles.replyIconCont}>
          <Icon
            style={styles.replyIcon}
            source="icon-reply-16"
          />
        </View>
        <View style={styles.replyMsgData}>
          <Text
            style={styles.replyMsgAuthor}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message.senderName}
          </Text>
          <Text
            style={styles.replyMsgText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {message.editBody}
          </Text>
        </View>
        <Icon
          touchStyle={styles.replyMsgDelIcon}
          onPress={::this.onRemoveMsgForReply}
          source="icon-trashcan-16"
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    width: '100%',
    bottom: 50,
    position: 'absolute',
    backgroundColor: '#FFF',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopColor: '$pe_color_apple_div',
    borderBottomColor: '$pe_color_apple_div',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 0,
  },

  replyIconCont: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  replyIcon: {
    color: '$pe_color_gray_7d',
  },

  replyMsgData: {
    flex: 1,
    alignSelf: 'stretch',
    borderLeftColor: '$pe_color_blue',
    borderLeftWidth: 1,
    paddingLeft: 4,
  },

  replyMsgDelIcon: {
    width: 30,
  },

  replyMsgAuthor: {
    color: '$pe_color_blue',
    fontWeight: '400',
    marginBottom: 2,
  },

  replyMsgText: {
    fontWeight: '400',
  },
});