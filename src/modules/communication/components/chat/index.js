import { Component, PropTypes } from 'react';
import { KeyboardAvoidingView, ListView, Platform } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import {
  BottomDock, ErrorBox, Icon, Loader, MoveYAnimElement, StyleSheet, Text, View,
} from 'ui';

import Footer from './Footer';
import MessageView from './MessageView';
import Header from './Header';
import ForwardMessage from './ForwardMessage';
import CommunicationStore from '../../../../store/communication';
import Message from '../../../../store/communication/models/Message';

const ANIM_POSITION_ADJUST = 65;
const REPLY_TOP = Platform.OS === 'ios' ? 76 : 75;
const REPLY_TOP_GROUP = Platform.OS === 'ios' ? 54 : 53;

@inject('communication')
@observer
export default class Chat extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  props: {
    communication?: CommunicationStore;
    style?: Object | number;
  };

  context: {
    navigator: Navigator;
  };

  state: {
    isAnimScroll: boolean;
    listHeight: number;
    listContentHeight: number;
    showForwardAnim: boolean;
    messageForForward: Message;
  };

  $listView: ListView;
  $thisInputElement: Footer;
  $msgForReply: Animatable.View;

  constructor(props) {
    super(props);

    this.state = {
      isAnimScroll: false,
      listHeight: 0,
      listContentHeight: 0,
      showForwardAnim: false,
      messageForForward: null,
    };
  }

  componentWillUnmount() {
    this.props.communication.removeMessageForReply();
  }

  onListContentSizeChange(listContentHeight) {
    const { isAnimScroll, listHeight } = this.state;
    const { selectedConversation } = this.props.communication;

    // isAnimScroll = false - only then we show chat first time
    if (isAnimScroll) {
      if (this.$listView && selectedConversation.isNewMessageAdded) {
        this.$listView.scrollToEnd({ animated: true });
        selectedConversation.clearNewMessageFlag();
      }
    } else if (this.$listView && listHeight !== 0
        && listContentHeight > listHeight) {
      // First time scrolling
      this.$listView.scrollToEnd({ animated: false });
    }

    // After first render of list switch scrollToEnd animated param to true
    // if listHeight === 0 we didn't scroll onListLayout will scrollToEnd
    // first time
    if (!isAnimScroll) {
      this.setState({
        listContentHeight,
        isAnimScroll: listHeight > 0,
      });
    }
  }

  onListLayout({ nativeEvent: { layout } }) {
    const { listContentHeight, listHeight } = this.state;

    if (listHeight !== 0) return;

    // Test if it runs after onContentChange and onContentChange
    // didn't has listHeight and do not scrollToEnd yet because of this
    if (listContentHeight !== 0 && listContentHeight > layout.height) {
      this.$listView.scrollToEnd({ animated: false });
    }

    // If listContentHeight === 0 we didn't scroll onContentChange will
    // scrollToEnd first time else it sets scrollToEnd animated param to true
    this.setState({
      listHeight: layout.height,
      isAnimScroll: listContentHeight > 0,
    });
  }

  onForwardMessageStart(message, posY) {
    this.setState({
      startPosY: posY - ANIM_POSITION_ADJUST,
      showForwardAnim: true,
      messageForForward: message,
    });
  }

  onForwardMessageEnd() {
    const { messageForForward } = this.state;
    const { communication } = this.props;

    // Add message to messages for forward to show it in dock
    // on other screens
    communication.addMessageForForward(messageForForward);
    this.setState({ showForwardAnim: false });
  }

  async onRemoveMsgForReply() {
    const { communication } = this.props;
    if (this.$msgForReply) {
      await this.$msgForReply.slideOutLeft(100);
    }

    communication.removeMessageForReply();
  }

  onScroll({ nativeEvent }) {
    const { communication } = this.props;
    if (nativeEvent.contentOffset.y <= 0) {
      communication.loadOlderMessages(communication.selectedConversationId);
    }
  }

  renderMessageForForward(message) {
    return (
      <ForwardMessage
        style={styles.forwardMessage}
        key={message.id}
        message={message}
      />
    );
  }

  renderHeader() {
    const { communication } = this.props;
    const ds = communication.conversationDs;

    if (!ds.isLoading) return null;

    return (
      <View style={styles.footer}>
        <Loader isLoading={ds.isLoading} />
      </View>
    );
  }

  renderRow(row) {
    return (
      <MessageView
        message={row}
        onForwardMessage={::this.onForwardMessageStart}
      />
    );
  }

  render() {
    const { communication, style } = this.props;
    const { showForwardAnim, startPosY, messageForForward } = this.state;
    const {
      isMsgsForForwardAvailable,
      msgsForForward,
      messageForReply,
      selectedConversation: conversation,
      selectedConversationDataSource: ds,
      selectedConversationId,
    } = communication;

    // This is hack to go to contacts list if we delete group we set
    // selectedConversationId = null. We need it because RNN doesn't have popTo
    if (!selectedConversationId) {
      this.context.navigator.pop({ animated: false });
      return null;
    }

    if (!conversation) {
      return (
        <Loader isLoading={ds.isLoading}>
          <ErrorBox message={ds.error} />
        </Loader>
      );
    }

    const replyMsgTop = conversation.isGroup ? REPLY_TOP_GROUP : REPLY_TOP;

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        contentContainerStyle={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <Header
          status={conversation.status}
          userName={conversation.name}
          conversationType={communication.selectedConversation.type}
        />
        <ListView
          contentContainerStyle={styles.list}
          dataSource={ds}
          enableEmptySections
          ref={ref => this.$listView = ref}
          renderHeader={::this.renderHeader}
          renderRow={::this.renderRow}
          initialListSize={conversation.messages.length}
          onContentSizeChange={(w, h) => this.onListContentSizeChange(h)}
          onLayout={::this.onListLayout}
          onScroll={::this.onScroll}
        />
        <Footer
          ref={ref => this.$thisInputElement = ref}
          conversationId={conversation.id}
          conversationType={communication.selectedConversation.type}
        />

        {messageForReply && (
          <Animatable.View
            style={[styles.replyMsgCont, { top: replyMsgTop }]}
            animation="slideInLeft"
            duration={150}
            ref={ref => this.$msgForReply = ref}
          >
            <Icon
              style={styles.replyIcon}
              source="icon-reply-16"
            />
            <Text
              style={styles.replyMsgText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Reply to: {communication.messageForReply.editBody}
            </Text>
            <Icon
              touchStyle={styles.delReplyMsgIcon}
              onPress={::this.onRemoveMsgForReply}
              source="icon-trashcan-16"
            />
          </Animatable.View>
        )}

        {showForwardAnim && (
          <MoveYAnimElement
            startPosY={startPosY}
            message={messageForForward ? messageForForward.body : ''}
            onAnimationEnd={::this.onForwardMessageEnd}
          />
        )}

        {isMsgsForForwardAvailable && (
          <BottomDock
            items={msgsForForward.slice()}
            renderItem={::this.renderMessageForForward}
          />
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 28,
    paddingVertical: 10,
  },

  forwardMessage: {
    marginLeft: 10,
  },

  replyMsgCont: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderBottomColor: '$pe_color_twitter',
    borderBottomWidth: 1,
    borderRightColor: '$pe_color_twitter',
    borderRightWidth: 1,
  },

  replyIcon: {
    paddingHorizontal: 8,
    color: '$pe_color_gray_7d',
  },

  delReplyMsgIcon: {
    paddingHorizontal: 8,
  },

  replyMsgText: {
    maxWidth: '78%',
  },

  footer: {
    paddingVertical: 5,
  },
});