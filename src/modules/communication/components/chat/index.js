import { Component, PropTypes } from 'react';
import { KeyboardAvoidingView, ListView, Platform } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import {
  BottomDock, ErrorBox, Icon, Loader, MoveYAnimElement, StyleSheet, Text, View,
} from 'ui';
import { ScreenParams } from 'utils';

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
    currentConversationId?: number;
  };

  context: {
    navigator: Navigator;
  };

  state: {
    showOlderMsgsLoader: boolean;
    isInitRun: boolean;
    listHeight: number;
    listContentHeight: number;
    showForwardAnim: boolean;
    messageForForward: Message;
  };

  $listView: ListView;
  $thisInputElement: Footer;
  $msgForReply: Animatable.View;
  spinnerLoader: Object;

  constructor(props) {
    super(props);

    this.state = {
      showOlderMsgsLoader: false,
      isInitRun: true,
      listHeight: 0,
      listContentHeight: 0,
      showForwardAnim: false,
      messageForForward: null,
    };
  }

  componentWillReceiveProps(newProps) {
    const { currentConversationId } = this.props;
    if (currentConversationId !== newProps.currentConversationId) {
      this.setState({
        isInitRun: true,
        listContentHeight: 0,
      });
    }
  }

  componentWillUnmount() {
    this.props.communication.removeMessageForReply();
    if (this.loaderTimer) {
      clearTimeout(this.loaderTimer);
    }
  }

  onListContentSizeChange(listContentHeight) {
    const { isInitRun, listHeight } = this.state;
    const { selectedConversation } = this.props.communication;

    if (listContentHeight > listHeight && listHeight !== 0) {
      if (isInitRun && this.$listView) {
        this.$listView.scrollToEnd({ animated: false });
      } else if (this.$listView && selectedConversation.isNewMessageAdded) {
        this.$listView.scrollToEnd({ animated: true });
        selectedConversation.clearNewMessageFlag();
      }
    } else if (this.$listView && listHeight !== 0) {
      this.$listView.scrollTo({ x: 0, y: 0, animated: true });
    }

    // After first render of list switch scrollToEnd animated param to true
    // if listHeight === 0 we didn't scroll onListLayout will scrollToEnd
    // first time
    this.setState({
      listContentHeight,
      isInitRun: listHeight === 0,
    });
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
      isInitRun: listContentHeight === 0,
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
      if (ScreenParams.isTabletLayout()) {
        await this.$msgForReply.slideOutRight(100);
      } else {
        await this.$msgForReply.slideOutLeft(100);
      }
    }

    communication.removeMessageForReply();
  }

  async onScroll({ nativeEvent }) {
    const { communication } = this.props;
    const { selectedConversation } = communication;

    if (nativeEvent.contentOffset.y <= 0) {
      if (!this.state.showOlderMsgsLoader
        && !selectedConversation.allMessagesFetched) {
        this.setState({ showOlderMsgsLoader: true });
      }

      if (!this.loaderTimer) {
        this.loaderTimer = setTimeout(() => {
          this.setState({ showOlderMsgsLoader: false });
          this.loaderTimer = null;
        }, 3000);
      }

      await communication.loadOlderMessages(
        communication.selectedConversationId
      );
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

  renderRow(row) {
    return (
      <MessageView
        message={row}
        onForwardMessage={::this.onForwardMessageStart}
      />
    );
  }

  renderHeader() {
    return (
      <View style={styles.listHeader}>
        <Loader isLoading={this.state.showOlderMsgsLoader} />
      </View>
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
    // only for phone layout
    const isTablet = ScreenParams.isTabletLayout();
    if (!selectedConversationId && !isTablet) {
      this.context.navigator.pop({ animated: false });
      return null;
    }

    if (!conversation) {
      return (
        <Loader isLoading={ds.isLoading}>
          {ds.isError && <ErrorBox message={ds.error} />}
        </Loader>
      );
    }


    const replyMsgTop = conversation.isGroup ? REPLY_TOP_GROUP : REPLY_TOP;
    const replyMsgContStyle = [
      isTablet ? styles.replyMsgContFromRight : styles.replyMsgContFromLeft,
      { top: replyMsgTop },
    ];

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
            style={replyMsgContStyle}
            animation={isTablet ? 'slideInRight' : 'slideInLeft'}
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
            style={isTablet ? styles.bottomDockTablet : null}
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

  replyMsgContFromRight: {
    height: 38,
    right: 0,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderBottomColor: '$pe_color_twitter',
    borderBottomWidth: 1,
    borderLeftColor: '$pe_color_twitter',
    borderLeftWidth: 1,
    alignItems: 'center',
  },

  replyMsgContFromLeft: {
    height: 38,
    left: 0,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderBottomColor: '$pe_color_twitter',
    borderBottomWidth: 1,
    borderRightColor: '$pe_color_twitter',
    borderRightWidth: 1,
    alignItems: 'center',
  },

  replyIcon: {
    paddingHorizontal: 8,
    color: '$pe_color_gray_7d',
  },

  delReplyMsgIcon: {
    paddingHorizontal: 16,
  },

  replyMsgText: {
    maxWidth: '78%',
  },

  listHeader: {
    paddingVertical: 5,
  },

  bottomDockTablet: {
    $topHeight: '80%',
    top: '$topHeight',
  },
});