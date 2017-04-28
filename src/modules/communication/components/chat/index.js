import { Component, PropTypes } from 'react';
import {
  Alert, Keyboard, KeyboardAvoidingView, ListView, Platform,
} from 'react-native';
import { Navigator } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, PopupMenu, StyleSheet, View } from 'ui';
import { ScreenParams } from 'utils';

import Footer from './Footer';
import MessageView from './MessageView';
import ReplyMessage from './ReplyMessage';
import CommunicationStore from '../../../../store/communication';
import Message from '../../../../store/communication/models/Message';

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
    showPopupMenu: boolean;
    popupPosY: number;
    popupPosX: number;
    selectedMessage: Message;
    isInitRun: boolean;
    listHeight: number;
    listContentHeight: number;
    keyboardHeight: number;
    selectMode: boolean;
  };

  onShowPopupMenu: (event: Object) => void;
  onDismissPopupMenu: (event: Object) => void;

  $listView: ListView;
  $keyboardAvoidView: KeyboardAvoidingView;
  $inputFooter: Footer;
  keyboardListeners: Array<Object>;

  constructor(props) {
    super(props);

    this.onShowPopupMenu = this.onShowPopupMenu.bind(this);
    this.onMessagePress = this.onMessagePress.bind(this);

    this.keyboardAppear = this.keyboardAppear.bind(this);
    this.keyboardDisappear = this.keyboardDisappear.bind(this);

    this.state = {
      showOlderMsgsLoader: false,
      showPopupMenu: false,
      popupPosY: 0,
      popupPosX: 0,
      selectedMessage: null,
      isInitRun: true,
      listHeight: 0,
      listContentHeight: 0,
      showForwardAnim: false,
      keyboardHeight: 0,
      selectMode: false,
    };
  }

  componentDidMount() {
    const updateListener = Platform.OS === 'android'
      ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android'
      ? 'keyboardDidHide' : 'keyboardWillHide';
    this.keyboardListeners = [
      Keyboard.addListener(updateListener, this.keyboardAppear),
      Keyboard.addListener(resetListener, this.keyboardDisappear),
    ];
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

    this.keyboardListeners.forEach(listener => listener.remove());
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

  onShowPopupMenu(event, message) {
    this.setState({
      showPopupMenu: true,
      popupPosY: event.pageY,
      popupPosX: event.pageX,
      selectedMessage: message,
    });
  }

  onDismissPopupMenu() {
    this.setState({
      showPopupMenu: false,
      popupPosY: 0,
      popupPosX: 0,
      selectedMessage: null,
    });
  }

  onMessagePress() {
    this.onDismissPopupMenu();
    Keyboard.dismiss();
  }

  onDeleteMessage() {
    const { communication } = this.props;
    const { selectedMessage } = this.state;

    if (!selectedMessage || selectedMessage.deleted) {
      return;
    }

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
          onPress: () => communication.deleteMessage(selectedMessage.id),
        },
      ],
      { cancelable: false }
    );
  }

  onInputInFocus() {
    this.onDismissPopupMenu();
  }

  onEditMessage() {
    const { selectedMessage } = this.state;

    this.context.navigator.push({
      screen: 'communication.EditMessage',
      animated: true,
      passProps: {
        message: selectedMessage,
        onSave: this.onSendEditedMessage.bind(this),
        fullEditorMode: false,
      },
    });
  }

  onSendEditedMessage(messageText) {
    const { selectedMessage } = this.state;
    if (selectedMessage) {
      this.props.communication.editMessage(selectedMessage.id, messageText);
    }
  }

  onReplyToMessage() {
    const { selectedMessage } = this.state;
    if (selectedMessage) {
      this.props.communication.setMessageForReply(selectedMessage);
    }

    this.onDismissPopupMenu();
    if (this.$inputFooter) {
      this.$inputFooter.wrappedInstance.setFocusToInput();
    }
  }

  onForwardMessage() {
    const { selectMode } = this.state;

    this.setState({ selectMode: !selectMode });
    this.props.communication.setSelectMode(!selectMode);
    this.onDismissPopupMenu();
  }

  getActionsForMessage(message: Message) {
    if (message.deleted) return null;

    const actions = [
      {
        title: 'Reply',
        action: ::this.onReplyToMessage,
      },
      {
        title: 'Forward',
        action: ::this.onForwardMessage,
      },
    ];

    if (message.editable) {
      actions.push({
        title: 'Edit',
        action: ::this.onEditMessage,
      });
    }

    if (message.deletable) {
      actions.push({
        title: 'Delete',
        action: ::this.onDeleteMessage,
      });
    }

    return actions;
  }

  keyboardAppear({ endCoordinates: { height } }) {
    this.setState({ keyboardHeight: height });
  }

  keyboardDisappear() {
    this.setState({ keyboardHeight: 0 });
  }

  renderRow(message) {
    return (
      <MessageView
        message={message}
        onPress={this.onMessagePress}
        onLongPress={this.onShowPopupMenu}
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
    const {
      keyboardHeight, showPopupMenu, popupPosY, popupPosX, selectedMessage,
    } = this.state;

    const {
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

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        contentContainerStyle={styles.container}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        ref={ref => this.$keyboardAvoidView = ref}
      >
        <ListView
          style={styles.list}
          contentContainerStyle={styles.listInsideCont}
          dataSource={ds}
          enableEmptySections
          keyboardShouldPersistTaps="handled"
          ref={ref => this.$listView = ref}
          renderHeader={::this.renderHeader}
          renderRow={::this.renderRow}
          initialListSize={conversation.messages.length}
          onContentSizeChange={(w, h) => this.onListContentSizeChange(h)}
          onLayout={::this.onListLayout}
          onScroll={::this.onScroll}
          removeClippedSubviews={false}
        />
        <Footer
          ref={ref => this.$inputFooter = ref}
          onInputInFocus={::this.onInputInFocus}
          conversationId={conversation.id}
          conversationType={communication.selectedConversation.type}
        />

        {messageForReply && <ReplyMessage />}

        {showPopupMenu && (
          <PopupMenu
            posY={popupPosY}
            keyboardOffset={keyboardHeight}
            posX={popupPosX}
            dismissAction={::this.onDismissPopupMenu}
            actions={this.getActionsForMessage(selectedMessage)}
          />
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  list: {
    flex: 1,
  },

  listInsideCont: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  forwardMessage: {
    marginLeft: 10,
  },

  listHeader: {
    paddingVertical: 5,
  },

  bottomDockTablet: {
    $topHeight: '80%',
    top: '$topHeight',
  },
});