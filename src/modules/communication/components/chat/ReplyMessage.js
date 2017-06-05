import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { BottomOverlay, Icon, StyleSheet, Text, View } from 'ui';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class ReplyMessage extends Component {
  props: {
    communication: CommunicationStore;
    style?: Object;
  };

  onRemoveMsgForReply() {
    const { communication } = this.props;
    communication.removeMessageForReply();
  }

  render() {
    const { communication, style } = this.props;
    const { messageForReply: message } = communication;

    return (
      <BottomOverlay style={style} onRemove={::this.onRemoveMsgForReply}>
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
      </BottomOverlay>
    );
  }
}

const styles = StyleSheet.create({
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