import { Component } from 'react';
import { Animated } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, Text, View } from 'ui';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class ForwardMessage extends Component {
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

  onRemoveMsgsForForward() {
    const { communication, onRemove } = this.props;

    Animated.timing(this.state.animValue, {
      toValue: 0,
      duration: 200,
    }).start(() => {
      communication.clearSelectedMessages();
      if (onRemove) {
        onRemove();
      }
    });
  }

  render() {
    const { selectedMessages } = this.props.communication;

    const message = selectedMessages.length === 1 ? selectedMessages[0] : null;

    const messageText = message
      ? message.editBody : `${selectedMessages.length} forwarded messages`;

    const senderNames = selectedMessages.reduce((result, m) => {
      if (result === '') {
        return result += m.senderName;
      } else if (result.includes(m.senderName)) {
        return result;
      }

      return result += `, ${m.senderName}`;
    }, '');

    return (
      <Animated.View
        style={[styles.container, { bottom: this.state.animValue }]}
      >
        <View style={styles.forwardIconCont}>
          <Icon
            style={styles.forwardIcon}
            source="icon-arrow-24"
          />
        </View>
        <View style={styles.forwardMsgData}>
          <Text
            style={styles.forwardMsgAuthor}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {senderNames}
          </Text>
          <Text
            style={styles.forwardMsgText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {messageText}
          </Text>
        </View>
        <Icon
          touchStyle={styles.forwardMsgDelIcon}
          onPress={::this.onRemoveMsgsForForward}
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

  forwardIconCont: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  forwardIcon: {
    color: '$pe_color_gray_7d',
  },

  forwardMsgData: {
    flex: 1,
    alignSelf: 'stretch',
    borderLeftColor: '$pe_color_blue',
    borderLeftWidth: 1,
    paddingLeft: 4,
  },

  forwardMsgDelIcon: {
    width: 30,
  },

  forwardMsgAuthor: {
    color: '$pe_color_blue',
    fontWeight: '400',
    marginBottom: 2,
  },

  forwardMsgText: {
    fontWeight: '400',
  },
});