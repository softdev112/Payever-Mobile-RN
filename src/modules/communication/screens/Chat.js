import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Alert } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';
import Chat from '../components/chat';
import Header from '../components/chat/Header';
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
            communication.setSelectMode(false);
          },
        },
      ],
      { cancelable: false }
    );
  }

  onCancelSelectedMode() {
    const { communication } = this.props;

    communication.clearSelectedMessages();
    communication.setSelectMode(false);
    communication.setForwardMode(false);
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

  render() {
    const {
      messengerInfo, selectedConversationId, selectMode, forwardMode,
    } = this.props.communication;
    const { avatar } = messengerInfo.byId(selectedConversationId);

    return (
      <View style={styles.container}>
        <NavBar>
          {(selectMode && !forwardMode) && (
            <NavBar.Button
              align="left"
              title="Delete All"
              onPress={::this.onDeleteAllMessages}
            />
          )}
          {!selectMode && <NavBar.Back />}

          <NavBar.ComplexTitle>
            <Header />
          </NavBar.ComplexTitle>
          {selectMode ? (
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
        <Chat style={styles.chat} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    borderColor: 'red',
    borderWidth: 1,
  },

  chat: {
    flex: 1,
  },
});