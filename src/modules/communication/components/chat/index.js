import { Component, PropTypes } from 'react';
import {
  Animated, Keyboard, KeyboardAvoidingView, FlatList, Platform,
} from 'react-native';
import { Navigator } from 'react-native-navigation';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, PopupMenu, StyleSheet, View } from 'ui';
import { ScreenParams } from 'utils';

import Footer from './Footer';
import SelectionFooter from './SelectionFooter';
import MessageView from './MessageView';
import ReplyMessage from './ReplyMessage';
import ForwardMessage from './ForwardMessage';
import EditMessage from './EditMessage';
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
  };

  context: {
    navigator: Navigator;
  };

  state: {
    messageCount: number;
    showOlderMsgsLoader: boolean;
    showPopupMenu: boolean;
    popupPosY: number;
    popupPosX: number;
    selectedMessage: Message;
    keyboardHeight: number;
    animValue: Animated.Value;
  };

  onShowPopupMenu: (event: Object) => void;
  onDismissPopupMenu: (event: Object) => void;

  $listView: FlatList;
  $keyboardAvoidView: KeyboardAvoidingView;
  $inputFooter: Footer;
  keyboardListeners: Array<Object>;

  constructor(props) {
    super(props);

    this.onShowPopupMenu = this.onShowPopupMenu.bind(this);
    this.onMessagePress = this.onMessagePress.bind(this);
    this.onMessageSelectChange = this.onMessageSelectChange.bind(this);

    this.keyboardAppear = this.keyboardAppear.bind(this);
    this.keyboardDisappear = this.keyboardDisappear.bind(this);

    const { selectedConversation } = this.props.communication;
    const messagesCount = selectedConversation
      ? selectedConversation.messages.length : 0;

    this.state = {
      messagesCount,
      showOlderMsgsLoader: false,
      showPopupMenu: false,
      popupPosY: 0,
      popupPosX: 0,
      selectedMessage: null,
      keyboardHeight: 0,
      animValue: new Animated.Value(0),
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

  componentWillUnmount() {
    const { communication } = this.props;
    communication.removeMessageForReply();
    communication.removeMessageForEdit();

    if (this.loaderTimer) {
      clearTimeout(this.loaderTimer);
    }

    this.keyboardListeners.forEach(listener => listener.remove());
  }

  /* eslint-disable sort-class-members/sort-class-members */
  componentWillReact() {
    const { communication } = this.props;
    const {
      messageForReply, messageForEdit, selectedConversation, selectedMessages,
    } = communication;
    const { selectMode } = communication.ui;
    const { animValue, messagesCount, showOlderMsgsLoader } = this.state;

    const newMessagesCount = selectedConversation
      ? selectedConversation.messages.length : 0;

    if (messagesCount !== newMessagesCount) {
      if (this.$listView && !showOlderMsgsLoader
        && !communication.isLoading) {
        this.$listView.scrollToOffset({ offset: 0, animated: true });
      }

      this.setState({ messagesCount: newMessagesCount });
    }

    /* eslint-disable no-underscore-dangle */
    const isMsgsForForward = selectedMessages.length > 0 && !selectMode;
    if ((isMsgsForForward || messageForReply || messageForEdit)) {
      if (animValue._value === 0) {
        Animated.timing(animValue, {
          toValue: 50,
          duration: 300,
        }).start();
      }
    } else if (animValue._value === 50) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
      }).start();
    }
    /* eslint-enable no-underscore-dangle */
  }

  async onViewableItemsChange({ viewableItems }) {
    if (!viewableItems || viewableItems.length === 0) return;

    const { communication } = this.props;
    const { selectedConversation } = communication;

    if (!selectedConversation || !selectedConversation.messages) return;

    const lastMessageIdx = selectedConversation.messages.length - 1;
    const currentMessageIdx = viewableItems[viewableItems.length - 1].index;

    if (lastMessageIdx === currentMessageIdx) {
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
    this.dismissPopupMenuAndKeyboard();
  }

  onDeleteMessage() {
    const { communication } = this.props;

    this.clearAllCurrentSelections();
    communication.ui.setSelectMode(true);
    communication.selectMessage(this.state.selectedMessage);
    this.onDismissPopupMenu();
  }

  onInputInFocus() {
    this.onDismissPopupMenu();
  }

  onEditMessage() {
    const { communication } = this.props;
    const { selectedMessage } = this.state;

    if (!selectedMessage) return;

    this.clearAllCurrentSelections();
    communication.setMessageForEdit(selectedMessage);

    this.onDismissPopupMenu();
    if (this.$inputFooter) {
      this.$inputFooter.wrappedInstance.setFocusToInput();
    }
  }

  onEmptyFieldTap() {
    this.dismissPopupMenuAndKeyboard();
  }

  onMessageSelectChange(select: boolean, message: Message) {
    const { communication } = this.props;
    if (select) {
      communication.selectMessage(message);
    } else {
      communication.deselectMessage(message.id);
    }
  }

  onReplyToMessage() {
    const { communication } = this.props;
    const { selectedMessage } = this.state;
    if (!selectedMessage) return;

    communication.setMessageForReply(selectedMessage);
    this.onDismissPopupMenu();

    if (this.$inputFooter) {
      this.$inputFooter.wrappedInstance.setFocusToInput();
    }
  }

  onForwardMessage() {
    const { communication } = this.props;

    communication.ui.setSelectMode(true);
    communication.ui.setForwardMode(true);
    communication.selectMessage(this.state.selectedMessage);
    this.onDismissPopupMenu();
  }

  dismissPopupMenuAndKeyboard() {
    this.onDismissPopupMenu();
    Keyboard.dismiss();
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

  clearAllCurrentSelections() {
    const { communication } = this.props;
    communication.removeMessageForReply();
    communication.removeMessageForEdit();
    communication.clearSelectedMessages();
  }

  keyboardAppear({ endCoordinates: { height } }) {
    this.setState({ keyboardHeight: height });
  }

  keyboardDisappear() {
    this.setState({ keyboardHeight: 0 });
  }

  renderItem({ item: message }) {
    const { communication } = this.props;

    return (
      <MessageView
        message={message}
        selected={communication.checkMessageSelected(message.id)}
        onPress={this.onMessagePress}
        onLongPress={this.onShowPopupMenu}
        onSelectPress={this.onMessageSelectChange}
        selectMode={communication.ui.selectMode}
        deleteMode={!communication.ui.forwardMode}
      />
    );
  }

  renderFooter() {
    return (
      <View style={styles.listHeader}>
        <Loader isLoading={this.state.showOlderMsgsLoader} />
      </View>
    );
  }

  render() {
    const { communication, style } = this.props;
    const {
      animValue, keyboardHeight, showPopupMenu, popupPosY, popupPosX,
      selectedMessage,
    } = this.state;

    const {
      messageForReply,
      messageForEdit,
      selectedConversation: conversation,
      selectedConversationId,
      selectedMessages,
      foundMessages,
      ui,
    } = communication;

    const isMsgsForForward = selectedMessages.length > 0 && !ui.selectMode;

    // TODO: try to use pop(n)
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
        <Loader isLoading={communication.isLoading}>
          {communication.isError && <ErrorBox message={communication.error} />}
        </Loader>
      );
    }

    let data;
    if (ui.searchMessagesMode && foundMessages.length !== 0) {
      data = foundMessages.slice().filter(m => !m.deleted).reverse();
    } else {
      data = conversation.messages.slice().reverse();
    }

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        contentContainerStyle={styles.container}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        ref={ref => this.$keyboardAvoidView = ref}
        onStartShouldSetResponder={() => true}
        onResponderGrant={::this.onEmptyFieldTap}
      >
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listInsideCont}
          keyboardShouldPersistTaps="handled"
          ref={ref => this.$listView = ref}
          ListFooterComponent={::this.renderFooter}
          renderItem={::this.renderItem}
          keyExtractor={item => item.id}
          data={data}
          onViewableItemsChanged={::this.onViewableItemsChange}
          removeClippedSubviews={false}
        />
        <Animated.View style={{ height: animValue }} />

        {ui.selectMode ? (
          <SelectionFooter />
        ) : (
          <Footer
            ref={ref => this.$inputFooter = ref}
            onInputInFocus={::this.onInputInFocus}
            textValue={messageForEdit ? messageForEdit.editBody : ''}
            conversationId={conversation.id}
            conversationType={communication.selectedConversation.type}
          />
        )}

        {messageForReply && <ReplyMessage />}
        {isMsgsForForward && <ForwardMessage />}
        {messageForEdit && <EditMessage />}

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
    transform: [{ scaleY: -1 }],
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