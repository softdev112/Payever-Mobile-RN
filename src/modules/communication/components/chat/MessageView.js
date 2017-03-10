import { Component } from 'react';
import { Alert } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Html, Icon, StyleSheet, Text, View } from 'ui';
import { inject, observer } from 'mobx-react/native';
import type Message from '../../../../store/communication/models/Message';
import Offer from '../../../marketing/components/OfferDetails';
import MediaView from './MediaView';
import type CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class MessageView extends Component {
  props: {
    message: Message;
    communication?: CommunicationStore;
    onRedirectMessage: (message: Message, pageY: number) => void;
  };

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

  deleteMessage() {
    const { communication, message } = this.props;
    communication.deleteMessage(message.id);
  }

  prepareForRedirectMessage({ nativeEvent: { pageY } }) {
    this.props.onRedirectMessage(this.props.message, pageY);
  }

  getSwipeButtons() {
    const { message } = this.props;

    if (message.deleted) return null;

    const rightButtons = [];
    if (!message.own) {
      rightButtons.push(
        <Icon
          onPress={() => {}}
          style={styles.actionIcon}
          source="icon-reply-16"
        />
      );
    }

    rightButtons.push(
      <Icon
        onPress={(e) => this.prepareForRedirectMessage(e)}
        style={styles.actionIcon}
        source="icon-arrow-right-3-16"
      />
    );

    if (message.editable) {
      rightButtons.push(
        <Icon
          onPress={() => {}}
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

  renderAvatar(avatar) {
    if (avatar.type === 'url') {
      const avatarUrl = avatar.valueRetina || avatar.value;
      return (
        <Icon style={styles.avatar} source={{ uri: avatarUrl }} />
      );
    }

    if (avatar.type === 'letters') {
      return (
        <View style={styles.avatarLetters}>
          <Text style={styles.avatarText}>{avatar.value}</Text>
        </View>
      );
    }

    return null;
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

    const { forwardFrom } = message;
    const msgHeader = forwardFrom
      ? `Forwarded From ${forwardFrom.senderName} ` : `${message.senderName} `;

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
      >
        <View style={styles.container}>
          {this.renderAvatar(message.avatar)}
          <View style={styles.message}>
            <View style={styles.header}>
              <Text style={styles.headerSender}>{msgHeader}</Text>
              <Text style={styles.headerDate}>{message.dateFormated}</Text>
            </View>
            <View style={styles.body}>
              {this.renderContent(message)}
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  actionIcon: {
    fontSize: 24,
  },

  actionIconContainer: {
    alignSelf: 'center',
  },

  avatar: {
    borderRadius: 16,
    height: 32,
    marginRight: 22,
    width: 32,
  },

  avatarLetters: {
    alignItems: 'center',
    borderColor: '#666',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    marginRight: 22,
    width: 32,
  },

  avatarText: {
    fontSize: 16,
  },

  body: {
    overflow: 'scroll',
  },

  container: {
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 50,
    width: '90%',
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

  swipeContainer: {
    width: '95%',
  },

  swipeContainerInside: {
    padding: 2,
  },
});