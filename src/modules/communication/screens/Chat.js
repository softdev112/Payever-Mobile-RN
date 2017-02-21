import { Component } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';

import Chat from '../components/chat';

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
        <NavBar.Default title="Communication" source={images.communication} />
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