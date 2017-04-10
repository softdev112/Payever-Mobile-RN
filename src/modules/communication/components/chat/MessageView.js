import { Component, PropTypes } from 'react';
import { Alert } from 'react-native';
import Swipeable from 'react-native-swipeable';
import type { Navigator } from 'react-native-navigation';
import { Html, Icon, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import { ScreenParams } from 'utils';

import MediaView from './MediaView';
import Avatar from '../contacts/Avatar';
import type Message from '../../../../store/communication/models/Message';
import Offer from '../../../marketing/components/OfferDetails';
import type CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class MessageView extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    message: Message;
    communication?: CommunicationStore;
    onForwardMessage: (message: Message, pageY: number) => void;
  };

  context: {
    navigator: Navigator;
  };

  $animMessageView: Animatable.View;
  $swipeRow: Swipeable;

  onDeleteMessagePress() {
    if (this.props.message.deleted) return;

    Alert.alert(
      'Attention!',
      'Delete message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.deleteMessage(),
        },
      ],
      { cancelable: false }
    );
  }

  onEditMessage() {
    const { message } = this.props;

    this.swipeBack();

    this.context.navigator.push({
      screen: 'communication.EditMessage',
      animated: true,
      passProps: {
        message,
      },
    });
  }

  onReplyToMessage() {
    const { communication, message } = this.props;
    communication.setMessageForReply(message);
    this.swipeBack();
  }

  deleteMessage() {
    const { communication, message } = this.props;
    communication.deleteMessage(message.id);
    this.swipeBack();
  }

  prepareForForward({ nativeEvent: { pageY } }) {
    const { communication, message } = this.props;

    if (communication.checkMsgInForForward(message.id)) {
      this.$animMessageView.shake(300).then(() => this.swipeBack());
      return;
    }

    this.swipeBack();
    this.props.onForwardMessage(this.props.message, pageY);
  }

  getSwipeButtons() {
    const { message } = this.props;

    if (message.deleted) return null;

    const rightButtons = [];
    rightButtons.push(
      <Icon
        onPress={::this.onReplyToMessage}
        style={styles.actionIcon}
        source="icon-reply-16"
      />
    );

    rightButtons.push(
      <Icon
        onPress={(e) => this.prepareForForward(e)}
        style={styles.actionIcon}
        source="icon-arrow-right-3-16"
      />
    );

    if (message.editable) {
      rightButtons.push(
        <Icon
          onPress={::this.onEditMessage}
          style={styles.actionIcon}
          source="icon-edit-16"
        />
      );
    }

    if (message.deletable) {
      rightButtons.push(
        <Icon
          onPress={::this.onDeleteMessagePress}
          style={styles.actionIcon}
          source="icon-trashcan-16"
        />
      );
    }

    return rightButtons;
  }

  swipeBack() {
    if (this.$swipeRow) {
      this.$swipeRow.recenter();
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
    const message: Message = this.props.message;

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
      <Swipeable
        style={styles.swipeContainer}
        rightButtons={this.getSwipeButtons()}
        rightButtonWidth={50}
        rightActionActivationDistance={80}
        contentContainerStyle={styles.swipeContainerInside}
        rightButtonContainerStyle={styles.actionIconContainer}
        onRightButtonsOpenRelease={() => this.setState({ isRowShift: true })}
        onRightButtonsCloseRelease={() => this.setState({ isRowShift: false })}
        onRef={ref => this.$swipeRow = ref}
      >
        <Animatable.View
          style={styles.container}
          ref={ref => this.$animMessageView = ref}
        >
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
        </Animatable.View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 50,
    width: ScreenParams.isTabletLayout() ? '94% - 350' : '70%',
    paddingRight: 5,
  },

  actionIcon: {
    fontSize: 24,
  },

  actionIconContainer: {
    alignSelf: 'center',
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

  swipeContainer: {
    width: ScreenParams.isTabletLayout() ? '98% - 350' : '95%',
  },

  swipeContainerInside: {
    padding: 2,
  },
});