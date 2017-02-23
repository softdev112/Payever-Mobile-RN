import { Component } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';

import Chat from '../components/chat';

export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    conversationId: number;
    isGroup: boolean;
  };

  render() {
    const { conversationId, isGroup } = this.props;
    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={images.communication} />
        <Chat conversationId={conversationId} isGroup={isGroup} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});