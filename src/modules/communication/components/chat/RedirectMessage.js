import { Component } from 'react';
import { Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';
import { ScreenParams } from 'utils';
import { inject, observer } from 'mobx-react/native';

import CommunicationStore from '../../../../store/communication';
import type Message from '../../../../store/communication/models/Message';

const MIN_WIDTH = 160;
const MAX_WIDTH = ScreenParams.width * 0.8; // 80% screen width

@inject('communication')
@observer
export default class RedirectMessage extends Component {
  props: {
    communication: CommunicationStore;
    message: Message;
    style?: Object;
  };

  state: {
    isWideOpen: boolean;
    animWidth: Object;
  };

  constructor(props) {
    super(props);

    this.state = {
      isWideOpen: false,
      animWidth: new Animated.Value(MIN_WIDTH),
    };
  }

  onResizeTap() {
    const { isWideOpen, animWidth } = this.state;

    Animated.timing(animWidth, {
      toValue: isWideOpen ? MIN_WIDTH : MAX_WIDTH,
      duration: 300,
      easing: Easing.elastic(2),
    }).start(this.setState({
      isWideOpen: !isWideOpen,
    }));
  }

  redirectMessage() {
    const { communication, message: { id } } = this.props;

    communication.forwardMessage(id);
    communication.removeMessageFromRedirect(id);
  }

  removeMessageFromRedirect() {
    const { communication, message: { id } } = this.props;

    communication.removeMessageFromRedirect(id);
  }

  render() {
    const { style, message } = this.props;
    const { animWidth } = this.state;

    const messageStr = message.offer ? message.offer.title : message.editBody;

    return (
      <Animated.View style={[styles.container, style, { width: animWidth }]}>
        <TouchableWithoutFeedback onPress={::this.onResizeTap}>
          <View style={styles.insideContainer}>
            <Text
              style={styles.message}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {messageStr}
            </Text>
            <View style={styles.btnsContainer}>
              <Icon
                onPress={::this.removeMessageFromRedirect}
                touchStyle={styles.actionIcon}
                source="icon-trashcan-24"
                hitSlope={{ top: 8, left: 8, bottom: 8, right: 8 }}
              />
              <Icon
                onPress={::this.redirectMessage}
                touchStyle={styles.actionIcon}
                source="icon-arrow-right-ios-24"
                hitSlope={{ top: 8, left: 8, bottom: 8, right: 8 }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    minWidth: MIN_WIDTH,
    width: MIN_WIDTH,
    backgroundColor: '#FFF',
    borderColor: '$pe_color_twitter',
    borderWidth: 2,
    borderRadius: 22,
    paddingVertical: 5,
  },

  insideContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  message: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
  },

  btnsContainer: {
    flexDirection: 'row',
  },

  actionIcon: {
    padding: 2,
    marginRight: 2,
    marginLeft: 12,
  },
});