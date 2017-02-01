import { Component } from 'react';
import { NavBar, StyleSheet, View } from 'ui';

import Chat from '../components/chat';

//noinspection JSUnresolvedVariable
import imgCommunication from '../images/communication.png';

export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    conversationId: number;
  };

  render() {
    const { conversationId } = this.props;
    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={imgCommunication} />
        <Chat conversationId={conversationId} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});