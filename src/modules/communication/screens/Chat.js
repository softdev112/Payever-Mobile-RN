import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';
import Chat from '../components/chat';
import Contacts from '../components/contacts';
import Header from '../components/chat/Header';
import SettingsFloatMenu from '../components/chat/SettingsFloatMenu';
import CommunicationStore from '../../../store/communication';
import UIStore from '../../../store/ui';

@inject('communication', 'ui')
@observer
export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    ui: UIStore;
    navigator: Navigator;
  };

  state: {
    showSettingsPopup: true;
  };

  $settingsPopup: SettingsFloatMenu;

  constructor(props) {
    super(props);

    this.state = {
      showSettingsPopup: false,
    };
  }

  onDeleteAllMessages() {
    const { communication } = this.props;
    const { selectedConversation } = communication;
    const messagesCount = selectedConversation.messages.length;

    if (messagesCount === 0) return;

    let warningText = `Delete All ${messagesCount}`;
    if (messagesCount === 1) {
      warningText += ' message?';
    } else {
      warningText += ' messages?';
    }

    Alert.alert(
      'Attention!',
      warningText,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            communication.deleteAllMsgsInSelectConversation();
            communication.ui.setSelectMode(false);
          },
        },
      ],
      { cancelable: false }
    );
  }

  onCancelSelectedMode() {
    const { communication } = this.props;

    communication.clearSelectedMessages();
    communication.ui.setSelectMode(false);
    communication.ui.setForwardMode(false);
  }

  onSettingsPress() {
    const { communication, navigator } = this.props;
    const { selectedConversation: conversation } = communication;

    if (!conversation) return;

    this.onRemoveSettingsPopup();

    if (conversation.isGroup) {
      navigator.push({
        screen: 'communication.GroupSettings',
        animated: true,
      });
    } else {
      navigator.push({
        screen: 'communication.ConversationSettings',
        animated: true,
      });
    }
  }

  onSwitchSettingsPopup() {
    const { showSettingsPopup } = this.state;

    if (showSettingsPopup && this.$settingsPopup) {
      this.$settingsPopup.wrappedInstance.hideSettingsPopup(
        ::this.onRemoveSettingsPopup
      );
    } else {
      this.setState({ showSettingsPopup: true });
    }
  }

  onRemoveSettingsPopup() {
    this.setState({ showSettingsPopup: false });
  }

  render() {
    const { communication, ui: appUI } = this.props;
    const {
      messengerInfo, selectedConversationId, ui,
    } = communication;
    const { showSettingsPopup } = this.state;
    const avatar = selectedConversationId
      ? messengerInfo.byId(selectedConversationId).avatar : null;

    return (
      <View style={styles.container}>
        {ui.searchMessagesMode ? (
          <NavBar style={styles.searchNavBar}>
            <NavBar.Search />
          </NavBar>
        ) : (
          <NavBar>
            {(ui.selectMode && !ui.forwardMode) && (
              <NavBar.Button
                align="left"
                title="Delete All"
                onPress={::this.onDeleteAllMessages}
              />
            )}
            {!ui.selectMode && <NavBar.Back />}

            <NavBar.ComplexTitle onPress={::this.onSwitchSettingsPopup}>
              <Header />
            </NavBar.ComplexTitle>

            {ui.selectMode ? (
              <NavBar.Button
                title="Cancel"
                onPress={::this.onCancelSelectedMode}
              />
            ) : (
              <NavBar.Avatar
                avatar={avatar}
                onPress={::this.onSettingsPress}
              />
            )}
          </NavBar>
        )}

        <KeyboardAvoidingView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          {!appUI.phoneMode && <Contacts style={styles.contacts} />}
          <Chat style={styles.chat} />
        </KeyboardAvoidingView>

        {showSettingsPopup && (
          <SettingsFloatMenu
            ref={r => this.$settingsPopup = r}
            onRemove={::this.onRemoveSettingsPopup}
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

  splitViewContainer: {
    flex: 1,
    flexDirection: 'row',
  },

  searchNavBar: {
    paddingHorizontal: 0,
  },

  contacts: {
    flex: 1,
    zIndex: 2,
    borderRightColor: '$pe_color_light_gray_1',
    borderRightWidth: 2,
  },

  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },

  chat: {
    flex: 1.55,
  },
});