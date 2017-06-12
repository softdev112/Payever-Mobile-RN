import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { BottomOverlay, Icon, StyleSheet, Text, View } from 'ui';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class ForwardMessage extends Component {
  props: {
    communication: CommunicationStore;
    style?: Object;
  };

  onRemoveMsgsForForward() {
    const { communication } = this.props;
    communication.clearSelectedMessages();
    communication.ui.setForwardMode(false);
  }

  render() {
    const { communication, style } = this.props;
    const { selectedMessages } = communication;

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
      <BottomOverlay
        style={style} onRemove={::this.onRemoveMsgsForForward}
        endBottom={communication.ui.chatFooterHeight}
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
      </BottomOverlay>
    );
  }
}

const styles = StyleSheet.create({
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