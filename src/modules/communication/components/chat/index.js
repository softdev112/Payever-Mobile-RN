import { Component, PropTypes } from 'react';
import { Animated, Keyboard, FlatList, Platform } from 'react-native';
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
    chatLayout: ComponentLayout;
    animValue: Animated.Value;
    conversationId: number;
  };

  onShowPopupMenu: (event: Object) => void;
  onDismissPopupMenu: (event: Object) => void;

  $listView: FlatList;
  $inputFooter: Footer;
  keyboardListeners: Array<Object>;

  constructor(props) {
    super(props);

    this.onShowPopupMenu = this.onShowPopupMenu.bind(this);
    this.onMessagePress = this.onMessagePress.bind(this);
    this.onMessageSelectChange = this.onMessageSelectChange.bind(this);

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
      chatLayout: {
        width: ScreenParams.width,
        height: ScreenParams.height,
      },
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const updateListener = Platform.OS === 'android'
      ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android'
      ? 'keyboardDidHide' : 'keyboardWillHide';
    this.keyboardListeners = [
      Keyboard.addListener(
        updateListener,
        ({ endCoordinates: { height } }) => {
          this.setState({ keyboardHeight: height });
        }
      ),
      Keyboard.addListener(
        resetListener,
        () => this.setState({ keyboardHeight: 0 })
      ),
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

  onChatViewLayout({ nativeEvent }) {
    if (!nativeEvent) return;

    this.setState({
      chatLayout: nativeEvent.layout,
    });
  }

  onShowPopupMenu(event, message) {
    // Calc click relative position considering chat layout
    const { chatLayout } = this.state;

    this.setState({
      showPopupMenu: true,
      popupPosY: event.pageY,
      popupPosX: event.pageX - (ScreenParams.width - chatLayout.width),
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

    // TODO: refactor communication ui use something like state-pattern
    // TODO: delete-state, forward-state
    communication.ui.setSelectMode(true);
    communication.ui.setForwardMode(false);
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
      selectedMessage, chatLayout,
    } = this.state;

    const {
      messageForReply,
      messageForEdit,
      selectedConversation: conversation,
      selectedMessages,
      foundMessages,
      ui,
    } = communication;

    const isMsgsForForward = selectedMessages.length > 0 && !ui.selectMode;

    if (!conversation) {
      return (
        <View style={[styles.container, style]}>
          <Loader isLoading={communication.isLoading}>
            {communication.isError && (
              <ErrorBox message={communication.error} />
            )}
          </Loader>
        </View>
      );
    }

    let data;
    if (ui.searchMessagesMode && foundMessages.length !== 0) {
      data = foundMessages.slice()
        .filter(m => !m.deleted)
        .reverse();
    } else {
      data = conversation.messages
        .slice()
        .reverse();
    }

    return (
      <View
        style={[styles.container, style]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={::this.onEmptyFieldTap}
        onLayout={::this.onChatViewLayout}
        key="a"
      >
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listInsideCont}
          keyboardShouldPersistTaps="always"
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

        {messageForReply && (
          <ReplyMessage style={{ width: chatLayout.width }} />
        )}
        {isMsgsForForward && (
          <ForwardMessage style={{ width: chatLayout.width }} />
        )}
        {messageForEdit && (
          <EditMessage style={{ width: chatLayout.width }} />
        )}

        {showPopupMenu && (
          <PopupMenu
            posY={popupPosY}
            posX={popupPosX}
            keyboardOffset={keyboardHeight}
            maxY={chatLayout.height}
            maxX={chatLayout.width}
            dismissAction={::this.onDismissPopupMenu}
            actions={this.getActionsForMessage(selectedMessage)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },

  list: {
    flex: 1,
    transform: [{ scaleY: -1 }],
  },

  listInsideCont: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  listHeader: {
    paddingVertical: 5,
  },
});

type ComponentLayout = {
  y: number;
  x: number;
  width: number;
  height: number;
};