import { Component } from 'react';
import { NavBar, StyleSheet, View } from 'ui';
import Chat from '../components/chat';
import Header from '../components/chat/Header';

export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back />
          <NavBar.ComplexTitle>
            <Header />
          </NavBar.ComplexTitle>
          <NavBar.IconButton
            imageStyle={styles.settingsIcon}
            onPress={() => {}}
            source="icon-settings-24"
          />
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

  settingsIcon: {
    color: '$pe_color_icon',
    fontSize: 20,
  },

  chat: {
    flex: 1,
  },
});