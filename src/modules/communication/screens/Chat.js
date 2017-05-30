import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Alert } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';
import Chat from '../components/chat';
import Header from '../components/chat/Header';
import SettingsFloatMenu from '../components/chat/SettingsFloatMenu';
import CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
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
    const {
      messengerInfo, selectedConversationId, ui,
    } = this.props.communication;
    const { showSettingsPopup } = this.state;
    const { avatar } = messengerInfo.byId(selectedConversationId);

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

        {showSettingsPopup && (
          <SettingsFloatMenu
            ref={r => this.$settingsPopup = r}
            onRemove={::this.onRemoveSettingsPopup}
          />
        )}
        <Chat />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchNavBar: {
    paddingHorizontal: 0,
  },
});